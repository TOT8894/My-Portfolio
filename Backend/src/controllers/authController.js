import { authService } from '../services/authService.js';

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const { accessToken, refreshToken, user } = await authService.login(email, password);

      // Set Refresh Token in secure HTTP-only Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        success: true,
        message: 'Admin login successful.',
        accessToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const { accessToken } = await authService.refreshAccessToken(refreshToken);
      return res.json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.json({ success: true, message: 'Signed out successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }
      const result = await authService.requestPasswordReset(email);
      return res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
      }
      const result = await authService.resetPassword(token, password);
      return res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      return res.json({ success: true, user: req.user });
    } catch (error) {
      next(error);
    }
  },
};
