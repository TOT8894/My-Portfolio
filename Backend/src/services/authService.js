import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { sendEmail } from '../config/mailer.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('FATAL SECURITY ERROR: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in .env');
}

// Resilient in-memory fallback admin synchronized with configured environment
const devAdminPassword = process.env.ADMIN_PASSWORD;
let devAdminUser = {
  id: 'dev-admin-id-1',
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  passwordHash: devAdminPassword ? bcrypt.hashSync(devAdminPassword, 10) : null,
  refreshToken: null,
  resetToken: null,
  resetTokenExpires: null,
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const authService = {
  async login(email, password) {
    let user = null;

    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (e) {
      console.warn('Prisma query bypassed, falling back to local memory:', e.message);
    }

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    if (!user && (email.toLowerCase() === (devAdminUser.email || '').toLowerCase() || (configuredAdminEmail && email.toLowerCase() === configuredAdminEmail))) {
      user = devAdminUser;
    }

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const targetHash = user.password || user.passwordHash;
    if (!targetHash) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, targetHash);
    if (!passwordMatches) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    try {
      if (user.id !== 'dev-admin-id-1') {
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken },
        });
      } else {
        devAdminUser.refreshToken = refreshToken;
      }
    } catch (e) {
      devAdminUser.refreshToken = refreshToken;
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  },

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required.');
      error.statusCode = 401;
      throw error;
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      const error = new Error('Invalid or expired refresh token.');
      error.statusCode = 403;
      throw error;
    }

    let user = null;
    try {
      user = await prisma.user.findFirst({
        where: { id: decoded.id, refreshToken },
      });
    } catch (e) {
      // Prisma query bypassed, checking fallback store
    }

    if (!user && devAdminUser.refreshToken === refreshToken) {
      user = devAdminUser;
    }

    if (!user) {
      const error = new Error('Refresh token revoked or session not found.');
      error.statusCode = 403;
      throw error;
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  },

  async logout(refreshToken) {
    if (refreshToken) {
      try {
        await prisma.user.updateMany({
          where: { refreshToken },
          data: { refreshToken: null },
        });
      } catch (e) {
        devAdminUser.refreshToken = null;
      }
    }
    return { success: true };
  },

  async requestPasswordReset(email) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    let userUpdated = false;
    try {
      const updated = await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: {
          resetToken,
          resetTokenExpires: expires,
        },
      });
      if (updated) userUpdated = true;
    } catch (e) {
      devAdminUser.resetToken = resetToken;
      devAdminUser.resetTokenExpires = expires;
      userUpdated = true;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://shanbeldires.pro.et';
    const resetUrl = `${frontendUrl}/admin/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'Shanbel Dires Portfolio - Password Reset Link',
      text: `Hello, you requested a password reset for your portfolio admin dashboard.\n\nClick the link to reset your password:\n${resetUrl}\n\nThis link is valid for 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #059669; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #334155; line-height: 1.5;">You requested a password reset for the Shanbel Dires Admin Portal.</p>
          <div style="margin: 24px 0;">
            <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    });

    return { message: 'Password reset link sent if account exists.' };
  },

  async resetPassword(token, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    let resetSuccess = false;

    try {
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpires: { gt: new Date() },
        },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null,
          },
        });
        resetSuccess = true;
      }
    } catch (e) {
      if (devAdminUser.resetToken === token && devAdminUser.resetTokenExpires > new Date()) {
        devAdminUser.passwordHash = hashedPassword;
        devAdminUser.resetToken = null;
        devAdminUser.resetTokenExpires = null;
        resetSuccess = true;
      }
    }

    if (!resetSuccess) {
      const error = new Error('Invalid or expired password reset token.');
      error.statusCode = 400;
      throw error;
    }

    return { message: 'Password updated successfully. You can now log in.' };
  },
};
