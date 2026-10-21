/**
 * Comprehensive Automated Backend Test Suite
 * Tests all API endpoints, database operations, security headers, rate limiting,
 * multi-image attributes, CV management, message inbox, and display ordering.
 */

import './src/config/env.js';
import http from 'http';
import app from './src/app.js';

const PORT = 5099; // Isolated test port
let server;
let baseUrl;

let adminAccessToken = '';
let adminRefreshToken = '';
let createdMessageId = '';
let testProjectId = `proj-test-${Date.now()}`;
let testCertId = `cert-test-${Date.now()}`;

const results = [];

function logPass(title) {
  console.log(`  ✅ PASS: ${title}`);
  results.push({ title, status: 'PASS' });
}

function logFail(title, err) {
  const errMsg = err ? (err.message || String(err)) : 'Assertion failed';
  console.error(`  ❌ FAIL: ${title}`);
  console.error(`     Error: ${errMsg}`);
  results.push({ title, status: 'FAIL', error: errMsg });
}

// Minimal HTTP client using native Node http
function request({ method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { ...headers },
    };

    let bodyStr = null;
    if (body) {
      if (Buffer.isBuffer(body)) {
        options.headers['Content-Length'] = body.length;
      } else {
        bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
        if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
      }
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }

        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', reject);
    if (Buffer.isBuffer(body)) req.write(body);
    else if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('🧪 STARTING COMPREHENSIVE BACKEND & PRODUCTION SECURITY TESTS');
  console.log('================================================================\n');

  try {
    // 1. Health Check
    console.log('--- 1. System Health & Diagnostics ---');
    const health = await request({ method: 'GET', path: '/api/health' });
    if (health.status === 200 && (health.data?.status === 'ok' || health.data?.status === 'UP')) {
      logPass(`GET /api/health returned 200 OK (Service: ${health.data.service || 'Active'})`);
    } else {
      throw new Error(`Expected status 200 with status ok/UP, got ${health.status} / ${JSON.stringify(health.data)}`);
    }

    // 2. Production Security Headers
    console.log('\n--- 2. Production Security Headers & Defense ---');
    if (health.headers['x-frame-options'] === 'SAMEORIGIN') {
      logPass('X-Frame-Options: SAMEORIGIN header present (Clickjacking defense)');
    } else {
      logFail('X-Frame-Options header missing or incorrect');
    }

    if (health.headers['x-content-type-options'] === 'nosniff') {
      logPass('X-Content-Type-Options: nosniff header present (MIME-sniffing defense)');
    } else {
      logFail('X-Content-Type-Options header missing');
    }

    if (health.headers['x-ratelimit-limit']) {
      logPass(`Rate Limiting Active (Limit: ${health.headers['x-ratelimit-limit']}, Remaining: ${health.headers['x-ratelimit-remaining']})`);
    } else {
      logFail('Rate limit headers missing');
    }

    // 3. Public Portfolio Dataset
    console.log('\n--- 3. Public Portfolio Endpoints ---');
    const portfolio = await request({ method: 'GET', path: '/api/portfolio' });
    if (portfolio.status === 200 && portfolio.data?.profile?.name) {
      logPass(`GET /api/portfolio returned 200 with full structure (Name: ${portfolio.data.profile.name})`);
    } else {
      throw new Error(`Failed to load portfolio data. Status: ${portfolio.status}`);
    }

    if (Array.isArray(portfolio.data?.projects) && portfolio.data.projects.length > 0) {
      logPass(`Portfolio Projects array loaded with ${portfolio.data.projects.length} entries`);
    } else {
      throw new Error('Projects array empty or missing');
    }

    if (portfolio.data?.cv !== undefined) {
      logPass(`Downloadable CV object present in portfolio response (Title: "${portfolio.data.cv?.title || 'Active'}")`);
    } else {
      throw new Error('CV object missing from portfolio endpoint');
    }

    // 4. Admin Authentication
    console.log('\n--- 4. Dual-Token Authentication & Security ---');
    const loginRes = await request({
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: process.env.ADMIN_EMAIL || 'admin@shanbeldires.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
    });

    if (loginRes.status === 200 && loginRes.data?.accessToken) {
      adminAccessToken = loginRes.data.accessToken;
      const cookieHeader = loginRes.headers['set-cookie'] || [];
      const refreshCookie = cookieHeader.find((c) => c.includes('refreshToken='));
      if (refreshCookie) {
        adminRefreshToken = refreshCookie.split(';')[0].replace('refreshToken=', '');
        logPass('Admin login succeeded (Access Token returned, httpOnly Refresh Token cookie set)');
      } else {
        logPass('Admin login succeeded with access token');
      }
    } else {
      throw new Error(`Login failed with status ${loginRes.status}: ${JSON.stringify(loginRes.data)}`);
    }

    // 5. Authenticated /me Route
    const meRes = await request({
      method: 'GET',
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });
    if (meRes.status === 200 && meRes.data?.user?.email) {
      logPass(`GET /api/auth/me authorized successfully (User: ${meRes.data.user.email})`);
    } else {
      throw new Error(`Failed to verify authenticated user: ${meRes.status}`);
    }

    // 6. Token Refresh
    if (adminRefreshToken) {
      const refreshRes = await request({
        method: 'POST',
        path: '/api/auth/refresh',
        headers: { Cookie: `refreshToken=${adminRefreshToken}` },
      });
      if (refreshRes.status === 200 && refreshRes.data?.accessToken) {
        logPass('POST /api/auth/refresh generated new Access Token from secure cookie');
      } else {
        logFail('Token refresh failed', refreshRes.data);
      }
    }

    // 7. Contact Message Submission (With All Details)
    console.log('\n--- 5. Contact Inquiries & Notification Dispatch ---');
    const contactPayload = {
      name: 'Dr. Dawit Mengistu',
      email: 'dawit.m@telecom-tech.et',
      phone: '+251 91 199 8877',
      subject: 'Network Topology & Cloud Migration Proposal',
      message: 'Greetings Shanbel, we reviewed your HCIA architecture and microservices projects. We are looking for a senior consultant for our core gateway setup in Addis Ababa.',
    };

    const contactRes = await request({
      method: 'POST',
      path: '/api/contact',
      body: contactPayload,
    });

    if (contactRes.status === 201 && contactRes.data?.success) {
      createdMessageId = contactRes.data.data?.id;
      logPass(`POST /api/contact accepted inquiry with full details (Phone: ${contactPayload.phone})`);
    } else {
      throw new Error(`Contact submission failed: ${contactRes.status}`);
    }

    // 8. Retrieve Messages in Admin Dashboard Inbox
    const messagesRes = await request({
      method: 'GET',
      path: '/api/contact/messages',
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });

    if (messagesRes.status === 200 && Array.isArray(messagesRes.data?.messages)) {
      const found = messagesRes.data.messages.find((m) => m.name === contactPayload.name);
      if (found && found.phone === contactPayload.phone) {
        logPass(`GET /api/contact/messages verified inquiry in Dashboard Inbox with Phone: ${found.phone}`);
      } else {
        logFail('Submitted inquiry not found in admin inbox with complete phone details');
      }
    } else {
      throw new Error(`Failed to retrieve admin messages: ${messagesRes.status}`);
    }

    // 9. Mark Message As Read
    if (createdMessageId) {
      const readRes = await request({
        method: 'PATCH',
        path: `/api/contact/messages/${createdMessageId}/read`,
        headers: { Authorization: `Bearer ${adminAccessToken}` },
      });
      if (readRes.status === 200) {
        logPass(`PATCH /api/contact/messages/${createdMessageId}/read updated message status`);
      } else {
        logFail('Failed to mark message read');
      }
    }

    // 9B. Direct Email Dispatcher (Send Glowing UI Email from Admin Dashboard)
    const directEmailRes = await request({
      method: 'POST',
      path: '/api/contact/send-email',
      headers: { Authorization: `Bearer ${adminAccessToken}` },
      body: {
        recipientEmail: 'dawit.m@telecom-tech.et',
        recipientName: 'Dr. Dawit Mengistu',
        subject: 'Re: Network Topology & Cloud Migration Proposal - Shanbel Dires',
        message: 'Thank you for your proposal Dr. Dawit. I have reviewed your requirements and would love to collaborate on configuring your core enterprise network and gateway routing.',
        messageId: createdMessageId,
      },
    });

    if (directEmailRes.status === 200 && directEmailRes.data?.success) {
      logPass('POST /api/contact/send-email dispatched modern glowing UI email directly to recipient');
    } else {
      logFail('Direct email dispatch failed', directEmailRes.data);
    }

    // 9C. Cloudinary Media Storage Upload (Zero Static Files)
    console.log('\n--- 6. Cloudinary Dynamic Media Storage ---');
    const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const boundary = '----CloudinaryTestBoundary' + Date.now();
    const multipartHeader = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="portfolio-test.png"\r\nContent-Type: image/png\r\n\r\n`;
    const multipartFooter = `\r\n--${boundary}--\r\n`;
    const multipartBody = Buffer.concat([Buffer.from(multipartHeader), tinyPng, Buffer.from(multipartFooter)]);

    const uploadRes = await request({
      method: 'POST',
      path: '/api/upload',
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    if (uploadRes.status === 201 && uploadRes.data?.url?.includes('cloudinary.com')) {
      logPass(`POST /api/upload streamed directly to Cloudinary (URL: ${uploadRes.data.url})`);
    } else {
      logFail('Cloudinary upload did not return a valid cloudinary.com URL', uploadRes.data);
    }

    // 10. Display Ordering Verification (New Project Comes First)
    console.log('\n--- 6. Project & Certificate Display Ordering (Newest First) ---');
    const newProject = {
      id: testProjectId,
      title: 'Automated NOC Telemetry Engine (Latest)',
      category: 'Infrastructure & IoT',
      shortDesc: 'Automated node telemetry and live network health scoring.',
      fullDesc: 'End to end telemetry system aggregating packet flows and alert thresholds.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80'
      ],
      architectureHighlights: ['WebSocket real time graphs', 'Prometheus exporter metrics'],
      practicalApplication: 'Tested on campus live infrastructure with zero packet loss.',
      tech: ['React', 'Node.js', 'WebSockets', 'HCIA'],
    };

    const createProjRes = await request({
      method: 'POST',
      path: '/api/portfolio/projects',
      headers: { Authorization: `Bearer ${adminAccessToken}` },
      body: newProject,
    });

    if (createProjRes.status === 201) {
      logPass('POST /api/portfolio/projects created new project with multi-image gallery');

      // Check that it now appears FIRST
      const afterProj = await request({ method: 'GET', path: '/api/portfolio' });
      const firstProject = afterProj.data?.projects?.[0];
      if (firstProject && firstProject.id === testProjectId) {
        logPass(`Verified display priority: New project "${firstProject.title}" is displayed FIRST at index 0!`);
      } else {
        logFail('New project was not prepended to index 0');
      }
    } else {
      logFail(`Create project failed with status ${createProjRes.status}`);
    }

    // 11. Display Ordering Verification (New Certificate Comes First)
    const newCert = {
      id: testCertId,
      title: 'Advanced Enterprise Cloud Architecture (Latest)',
      issuer: 'Huawei & Cloud Academy',
      date: '2026',
      certId: 'CLOUD-ARCH-2026-9901',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Accreditation covering hybrid cloud networking and dynamic BGP peering.',
      validatedSkills: ['Hybrid Cloud Peering', 'VRP Automation'],
      practicalApplication: 'Engineered high-availability cloud interconnects.',
    };

    const createCertRes = await request({
      method: 'POST',
      path: '/api/portfolio/certificates',
      headers: { Authorization: `Bearer ${adminAccessToken}` },
      body: newCert,
    });

    if (createCertRes.status === 201) {
      logPass('POST /api/portfolio/certificates created new certificate');

      const afterCert = await request({ method: 'GET', path: '/api/portfolio' });
      const firstCert = afterCert.data?.certificates?.[0];
      if (firstCert && firstCert.id === testCertId) {
        logPass(`Verified display priority: New certificate "${firstCert.title}" is displayed FIRST at index 0!`);
      } else {
        logFail('New certificate was not prepended to index 0');
      }
    } else {
      logFail(`Create cert failed with status ${createCertRes.status}`);
    }

    // 12. CV / Resume Management (Add, Update, Delete)
    console.log('\n--- 7. CV / Resume Management ---');
    const updateCvRes = await request({
      method: 'PUT',
      path: '/api/portfolio/cv',
      headers: { Authorization: `Bearer ${adminAccessToken}` },
      body: {
        title: 'Shanbel Dires - Certified Full-Stack & Network Architect CV (2026)',
        fileName: 'Shanbel_Dires_2026_CV.pdf',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample_cv.pdf',
        isActive: true,
      },
    });

    if (updateCvRes.status === 200 && updateCvRes.data?.cv?.fileName === 'Shanbel_Dires_2026_CV.pdf') {
      logPass('PUT /api/portfolio/cv updated CV details and download link successfully');

      const checkCv = await request({ method: 'GET', path: '/api/portfolio' });
      if (checkCv.data?.cv?.fileUrl === 'https://res.cloudinary.com/demo/image/upload/sample_cv.pdf') {
        logPass('Verified GET /api/portfolio serves updated CV for visitor download');
      } else {
        logFail('CV update not reflected in public portfolio dataset');
      }
    } else {
      logFail('Update CV endpoint failed', updateCvRes.data);
    }

    // 13. Input Sanitization Test (XSS Attack Payload)
    console.log('\n--- 8. Security Input Sanitization (XSS Defenses) ---');
    const xssContact = await request({
      method: 'POST',
      path: '/api/contact',
      body: {
        name: 'Hacker<script>alert("xss")</script>',
        email: 'attacker@evil.com',
        phone: '0911000000',
        subject: 'Inquiry with <script>evil()</script> injection',
        message: 'Hello <img src="x" onerror="evil()" /> world',
      },
    });

    if (xssContact.status === 201) {
      const saved = xssContact.data?.data;
      if (saved && !saved.name.includes('<script>') && !saved.subject.includes('<script>')) {
        logPass('XSS script tags successfully stripped by sanitizeInputs middleware');
      } else {
        logFail('Script tags were not stripped');
      }
    }

    // Cleanup: Delete the test project and certificate
    await request({
      method: 'DELETE',
      path: `/api/portfolio/projects/${testProjectId}`,
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });
    await request({
      method: 'DELETE',
      path: `/api/portfolio/certificates/${testCertId}`,
      headers: { Authorization: `Bearer ${adminAccessToken}` },
    });

  } catch (err) {
    console.error('💥 Test Suite Encountered Fatal Exception:', err);
  } finally {
    console.log('\n================================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${results.filter(r => r.status === 'PASS').length} Passed, ${results.filter(r => r.status === 'FAIL').length} Failed`);
    console.log('================================================================\n');

    server.close(() => {
      process.exit(results.some((r) => r.status === 'FAIL') ? 1 : 0);
    });
  }
}

// Start temporary local server on PORT 5099 and execute tests
server = app.listen(PORT, '127.0.0.1', () => {
  baseUrl = `http://127.0.0.1:${PORT}`;
  runTestSuite();
});
