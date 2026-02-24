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
      
      <div style="padding: 30px 25px; color: #202124; font-size: 15px; line-height: 1.6;">
        <p style="font-size: 16px;">Hi <strong>${studentName}</strong>,</p>
        
        <p>Warm greetings from the <strong>Career Vidya Edu Tech Team</strong>, and we welcome you to a journey built on clarity, trust, and informed decision making.</p>
        
        <p>Thank you for registering with Career Vidya. By taking this step, you’ve chosen a platform that believes education decisions should be guided, verified, and stress free. Whether you are a student, a working professional, or someone restarting their academic journey, we are here to ensure you receive complete support from start to success.</p>
        
        <p>In today’s education landscape, choosing the right university can be overwhelming. With countless options available, questions around degree validity, university credibility, and career outcomes are natural. This is where Career Vidya steps in to simplify choices, remove confusion, and guide you toward programmes that genuinely add value to your future.</p>

        <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #1a73e8; font-weight: bold; font-size: 16px; margin: 0 0 15px 0;">Why students trust Career Vidya:</p>
          <ul style="margin: 0; padding-left: 20px; color: #3c4043; list-style-type: disc;">
            <li style="margin-bottom: 8px;">100% Free Expert Counselling</li>
            <li style="margin-bottom: 8px;">One-on-One Personalized Guidance</li>
            <li style="margin-bottom: 8px;">Association with Verified & Globally Recognized Universities</li>
            <li style="margin-bottom: 8px;">100% Job Assistance Support</li>
            <li style="margin-bottom: 8px;">No-Cost EMI Options</li>
            <li style="margin-bottom: 8px;">Education Loan & Scholarship Assistance</li>
            <li style="margin-bottom: 0;">Access to a strong network of 10,000+ Alumni</li>
          </ul>
        </div>

        <p><strong>Important Note:</strong> Career Vidya is a completely transparent and legitimate platform. We do not charge any counselling or guidance fees, and your privacy is our priority. Your data is safe with us and is never misused or shared.</p>

        <p>If you have any questions, simply reply to this email—we’re happy to help. You may also connect directly with our expert advisor:</p>
        
        <div style="margin: 20px 0; padding: 15px; border: 1px dashed #1a73e8; border-radius: 8px; text-align: center;">
          <p style="margin: 5px 0;">📞 <strong>+91-9289712364</strong></p>
          <p style="margin: 5px 0;">✉️ <strong>info@careervidya.in</strong></p>
        </div>

        <p>Before we conclude, Career Vidya is led by <strong>Mr. Abhimanyu Singh Chauhan</strong>, Founder & CEO, whose vision is to provide honest guidance and verified institutions to every individual.</p>

        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Warm regards,<br>
          <strong>Team Career Vidya</strong><br>
          <span style="font-size: 13px; color: #5f6368;">On behalf of</span><br>
          <strong>Abhimanyu Chauhan</strong><br>
          Founder & CEO – Career Vidya<br>
          <em>Your Trusted Education Partner</em>
        </p>
      </div>

      <div style="padding: 20px; text-align: center; background-color: #f1f3f4; font-size: 12px; color: #70757a;">
        &copy; ${currentYear} Career Vidya. All rights reserved.<br>
        Your future deserves the right direction.
      </div>
    </div>
  `;
};