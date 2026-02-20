/**
 * OTP Verification Email Template
 */
export const getOTPTemplate = (otp) => {
  const currentYear = new Date().getFullYear();
  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 450px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="background-color: #1a73e8; height: 6px;"></div>
        
        <div style="padding: 30px 20px 10px 20px; text-align: center;">
          <h2 style="color: #202124; margin: 0; font-size: 22px;">Verification Required</h2>
          <p style="color: #5f6368; font-size: 15px; margin-top: 10px;">Enter the verification code below to securely access your account</p>
        </div>

        <div style="padding: 20px; text-align: center;">
          <div style="background-color: #f1f3f4; border-radius: 8px; padding: 25px; display: inline-block; min-width: 200px;">
            <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #1a73e8;">${otp}</span>
          </div>
          
          <div style="margin-top: 15px; padding: 8px; background-color: #fff4e5; border-radius: 4px; display: inline-block;">
            <p style="color: #b95000; font-size: 13px; font-weight: bold; margin: 0;">
              ⚠️ Note: This OTP expires in 5 minutes
            </p>
          </div>
        </div>

        <div style="padding: 0 30px; color: #3c4043; font-size: 14px;">
          <p style="margin-bottom: 5px;">Thanks & Regards,</p>
          <p style="margin: 0; font-weight: bold; color: #1a73e8;">Careervidya</p>
          <p style="margin: 2px 0; font-style: italic; color: #5f6368; font-size: 12px;">#vidyahaitosuccesshai</p>
        </div>

        <div style="margin: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #3c4043; font-weight: 500;">Need Help?</p>
          <p style="margin: 5px 0 10px 0; font-size: 13px; color: #5f6368;">If you did not request this code, reach out to our support team</p>
          <a href="mailto:support@careervidya.in" style="color: #1a73e8; text-decoration: none; font-weight: bold; font-size: 14px; border: 1px solid #1a73e8; padding: 5px 15px; border-radius: 4px; display: inline-block;">
            📩 support@careervidya.in
          </a>
        </div>

        <div style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
          <a href="https://careervidya.in" style="text-decoration: none; color: #5f6368; font-size: 13px; font-weight: 600;">Visit our website Careervidya.in</a>
          <div style="margin-top: 15px; color: #9aa0a6; font-size: 11px;">
            &copy; ${currentYear} Careervidya.in. All rights reserved.
          </div>
        </div>
      </div>
  `;
};

/**
 * Welcome / Registration Email Template
 */
export const getWelcomeTemplate = (studentName) => {
  const currentYear = new Date().getFullYear();
  return `
    <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background-color: #1a73e8; height: 8px;"></div>
      <div style="padding: 25px 20px; color: #202124; font-size: 14px; line-height: 1.6;">
        <p>Hi ${studentName},</p>
        <p>Warm greetings from the <strong>Career Vidya Edu-Tech Team</strong>, and we welcome you to a journey built on clarity, trust, and informed decision-making.</p>
        <p>Thank you for registering with Career Vidya...</p>
        <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 15px; margin: 20px 0;">
          <p style="color: #1a73e8; font-weight: bold; margin: 0 0 10px 0;">Why students trust Career Vidya:</p>
          <ul style="margin: 0; padding-left: 18px; color: #3c4043;">
            <li>100% Free Counselling from Experts</li>
            <li>One-on-One Personalized Guidance Sessions</li>
            <li>100% Job Assistance Support</li>
          </ul>
        </div>
        <p>Warm regards,<br><strong>Abhimanyu Singh Chauhan</strong><br>Founder & CEO – Career Vidya</p>
      </div>
      <div style="padding: 15px; text-align: center; background-color: #f1f3f4; font-size: 11px; color: #70757a;">
        &copy; ${currentYear} Career Vidya. All rights reserved.
      </div>
    </div>
  `;
};