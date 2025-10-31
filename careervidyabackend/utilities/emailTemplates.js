export const otpTemplate = (otp, context = "Password Reset") => ({
  subject: `CareerVidya OTP Code (valid 10 minutes)`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #fafafa;">
      <h2 style="color: #2c3e50;">${context}</h2>
      <p style="font-size: 15px; color: #555;">
        Use the OTP code below to proceed.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background: #2ecc71; color: #fff; padding: 15px 25px; font-size: 20px; font-weight: bold; border-radius: 8px; letter-spacing: 2px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #888;">
        ⚠️ Valid for <strong>10 minutes</strong>. Do not share it with anyone.
      </p>
      <p style="font-size: 14px; color: #888;">
        If you didn’t request this, you can ignore this email.
      </p>
      <hr/>
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        &copy; ${new Date().getFullYear()} careervidya. All rights reserved.
      </p>
    </div>
  `
});

export const welcomeTemplate = (name) => ({
  subject: `👋 Welcome to careerVidya, ${name}!`,
  html: `
    <h2>Welcome, ${name}!</h2>
    <p>We’re excited to have you onboard. Start exploring careervidya today 🚀</p>
  `
});

export const newsletterTemplate = (subject, body) => ({
  subject,
  html: `
    <h2>${subject}</h2>
    <div>${body}</div>
  `
});

export const verifyEmailTemplate = (name, verifyLink) => ({
  subject: `Verify your CareerVidya email, ${name}`,
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; max-width: 680px; margin: 0 auto; padding: 28px; background: #f6f9fc; color: #0f1724;">
      <div style="background: linear-gradient(90deg,#6c5ce7,#00b894); padding: 24px; border-radius: 12px 12px 0 0; text-align: center; color: #fff;">
        <h1 style="margin:0; font-size:22px; letter-spacing: -0.4px;">Confirm your email</h1>
        <p style="margin:6px 0 0; opacity:0.95;">One more step to get started with CareerVidya</p>
      </div>

      <div style="background:#ffffff; padding:24px; border-radius:0 0 12px 12px; box-shadow: 0 6px 18px rgba(16,24,40,0.06);">
        <p style="font-size:15px; color:#102a43; margin:0 0 16px;">Hi ${name || 'there'},</p>

        <p style="font-size:15px; color:#334e68; line-height:1.5; margin:0 0 20px;">Thanks for creating an account on <strong>CareerVidya</strong>. Please confirm your email address by clicking the button below. This helps us keep your account secure and ensures we can reach you about important updates.</p>

        <div style="text-align:center; margin: 22px 0;">
          <a href="${verifyLink}" target="_blank" rel="noopener" style="display:inline-block; background:linear-gradient(90deg,#6c5ce7,#00b894); color:#fff; padding:12px 22px; border-radius:10px; text-decoration:none; font-weight:600; box-shadow: 0 6px 18px rgba(108,92,231,0.18);">Verify Email</a>
        </div>

        <p style="font-size:13px; color:#627d98; margin:0 0 12px;">If the button doesn't work, copy and paste the following link into your browser:</p>
        <p style="font-size:12px; word-break:break-all; color:#0f1724; background:#f1f5f9; padding:10px; border-radius:6px;">${verifyLink}</p>

        <hr style="border:none; border-top:1px solid #eef2f6; margin:20px 0;">

        <p style="font-size:13px; color:#526a7a; margin:0;">If you didn't create an account with us, you can safely ignore this email.</p>

        <p style="font-size:13px; color:#526a7a; margin:12px 0 0;">Thanks,<br/>The CareerVidya Team</p>

        <div style="margin-top:18px; display:flex; gap:12px; align-items:center;">
          <img src="https://raw.githubusercontent.com/your-org/placeholder/main/logo-small.png" alt="CareerVidya" style="width:56px; height:56px; border-radius:8px; object-fit:cover;">
          <div style="font-size:12px; color:#98a8b9;">&copy; ${new Date().getFullYear()} CareerVidya. All rights reserved.</div>
        </div>
      </div>
    </div>
  `
});
