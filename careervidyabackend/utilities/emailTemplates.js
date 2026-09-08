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
/**
 * Newsletter double opt-in confirmation email
 */
export const getNewsletterConfirmTemplate = (confirmUrl) => {
  const currentYear = new Date().getFullYear();
  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <div style="background-color: #1a73e8; height: 6px;"></div>
      <div style="padding: 30px 24px 10px 24px; text-align: center;">
        <h2 style="color: #202124; margin: 0; font-size: 22px;">Confirm your subscription</h2>
        <p style="color: #5f6368; font-size: 15px; margin-top: 10px;">
          One quick step — confirm you'd like to receive updates from CareerVidya.
        </p>
      </div>
      <div style="padding: 20px 24px 30px; text-align: center;">
        <a href="${confirmUrl}" style="display: inline-block; background-color: #1a73e8; color: #fff; text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: 8px; font-size: 15px;">
          Confirm Subscription
        </a>
        <p style="color: #9aa0a6; font-size: 12px; margin-top: 18px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <div style="padding: 16px; text-align: center; background-color: #f1f3f4; font-size: 12px; color: #70757a;">
        &copy; ${currentYear} Career Vidya. All rights reserved.
      </div>
    </div>
  `;
};

/**
 * Newsletter campaign email — wraps the admin's HTML body with an unsubscribe
 * footer and (invisible) open-tracking pixel.
 */
export const getNewsletterCampaignTemplate = (bodyHtml, unsubscribeUrl, trackingPixelUrl) => {
  const currentYear = new Date().getFullYear();
  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 20px;">
        ${bodyHtml}
      </div>
      <div style="padding: 16px; text-align: center; background-color: #f1f3f4; font-size: 12px; color: #70757a;">
        &copy; ${currentYear} Career Vidya. All rights reserved.<br>
        <a href="${unsubscribeUrl}" style="color: #70757a;">Unsubscribe</a> from these emails.
      </div>
      <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />
    </div>
  `;
};

/**
 * Website Query Confirmation Email
 */

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const getQueryConfirmationTemplate = (name) => {
  const currentYear = new Date().getFullYear();
  const safeName = escapeHtml(name || "there");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for Query - Career Vidya</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f8fc;
  font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background:#f4f8fc; padding:30px 10px;">

  <tr>
    <td align="center">

      <!-- MAIN CONTAINER -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="
          max-width:600px;
          width:100%;
          background:#ffffff;
          border-radius:16px;
          overflow:hidden;
          border:1px solid #e5edf6;
        ">

        <!-- TOP BRAND SECTION -->
        <tr>
          <td align="center"
            style="
              padding:30px 20px 22px;
              background:#ffffff;
              border-top:5px solid #123f78;
            ">

            <!-- LOGO -->
            <!--
              NOTE: cid:career-vidya-logo ONLY works if your send function
              attaches the logo as an inline attachment with that exact cid.
              Example (nodemailer):

              transporter.sendMail({
                ...
                html: getQueryConfirmationTemplate(name),
                attachments: [
                  {
                    filename: "logo.png",
                    path: "./assets/career-vidya-logo.png", // or a Buffer/URL
                    cid: "career-vidya-logo" // must match the img src exactly
                  }
                ]
              });

              If you don't want to manage attachments, replace the src below
              with a permanent HTTPS URL of your hosted logo instead — that
              is more reliable across Gmail/Outlook and needs no attachment:
              src="https://your-domain.com/assets/logo.png"
            -->
            <img
              src="cid:career-vidya-logo"
              alt="Career Vidya"
              width="190"
              style="
                display:block;
                width:190px;
                max-width:80%;
                height:auto;
                margin:0 auto 10px;
              "
            >

            <!-- TAGLINE -->
            <div style="
              font-size:16px;
              color:#123f78;
              font-style:italic;
              font-weight:600;
            ">
              Vidya hai to Success hai
            </div>

            <div style="
              width:55px;
              height:3px;
              background:#f47721;
              margin:12px auto 0;
              border-radius:10px;
            "></div>

          </td>
        </tr>


        <!-- HERO -->
        <tr>
          <td style="padding:15px 38px 10px;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>

                <!-- LEFT: Text -->
                <td valign="middle" style="padding-right:10px;">

                  <div style="
                    font-size:15px;
                    color:#1261bd;
                    font-weight:600;
                    margin-bottom:8px;
                  ">
                    Your Query Has Been Received
                  </div>

                  <div style="
                    width:125px;
                    height:3px;
                    background:#f47721;
                    margin-bottom:18px;
                  "></div>

                  <h1 style="
                    margin:0;
                    font-size:38px;
                    line-height:1.05;
                    color:#123f78;
                    font-weight:800;
                  ">
                    Thanks for
                    <span style="color:#f47721;">
                      Query!
                    </span>
                  </h1>

                </td>

                <!-- RIGHT: Envelope illustration (CSS/emoji built,
                     no external image needed — always renders) -->
                <td width="150" valign="top" align="center" style="padding-top:6px;">

                  <div style="
                    font-size:11px;
                    color:#1261bd;
                    font-style:italic;
                    font-weight:700;
                    line-height:1.3;
                    margin-bottom:10px;
                  ">
                    We're<br>Here for You ✈️
                  </div>

                  <div style="
                    position:relative;
                    width:110px;
                    height:90px;
                    margin:0 auto;
                    background:#e8f1fb;
                    border-radius:22px;
                  ">
                    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" valign="middle">
                          <div style="font-size:44px; line-height:1;">
                            ✉️
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="
                      position:absolute;
                      bottom:-8px;
                      right:-6px;
                      width:30px;
                      height:30px;
                      background:#2ecc71;
                      border-radius:50%;
                      border:3px solid #ffffff;
                      color:#ffffff;
                      font-size:16px;
                      font-weight:900;
                      text-align:center;
                      line-height:24px;
                    ">
                      ✓
                    </div>
                  </div>

                </td>

              </tr>
            </table>

          </td>
        </tr>


        <!-- GREETING -->
        <tr>
          <td style="
            padding:25px 38px 10px;
            color:#173f70;
          ">

            <h2 style="
              margin:0 0 15px;
              font-size:27px;
              color:#123f78;
            ">
              Hi ${safeName},
            </h2>

            <p style="
              margin:0 0 10px;
              font-size:16px;
              line-height:1.7;
              color:#24466e;
            ">
              We have received your Interest.
            </p>

            <p style="
              margin:0;
              font-size:16px;
              line-height:1.7;
              color:#24466e;
            ">
              Please provide a suitable time slot by which we can
              connect with you!
            </p>

          </td>
        </tr>


        <!-- NEXT STEP CARD -->
        <tr>
          <td style="padding:25px 38px;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0"
              style="
                background:#f1f8ff;
                border:1px solid #d4e8fb;
                border-radius:14px;
              ">

              <tr>

                <!-- ICON -->
                <td width="115" align="center"
                  style="padding:25px 10px;">

                  <div style="
                    width:72px;
                    height:72px;
                    background:#e1f0ff;
                    border-radius:50%;
                    text-align:center;
                    line-height:72px;
                    font-size:34px;
                  ">
                    📅
                  </div>

                </td>


                <!-- TEXT -->
                <td style="
                  padding:25px 15px 25px 5px;
                  border-left:3px solid #1261bd;
                ">

                  <div style="
                    display:inline-block;
                    background:#f47721;
                    color:#ffffff;
                    padding:7px 15px;
                    border-radius:20px;
                    font-size:14px;
                    font-weight:bold;
                    margin-bottom:12px;
                  ">
                    🕐 &nbsp; Next Step
                  </div>

                  <div style="
                    color:#123f78;
                    font-size:18px;
                    line-height:1.5;
                    font-weight:700;
                  ">
                    Please provide a suitable time slot
                    by which we can connect with you.
                  </div>

                  <div style="
                    margin-top:8px;
                    color:#37699d;
                    font-size:14px;
                  ">
                    Our team will connect with you soon.
                  </div>

                </td>

              </tr>

            </table>

          </td>
        </tr>


        <!-- BENEFITS -->
        <tr>
          <td style="padding:5px 25px 20px;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0">

              <tr>

                <td align="center" width="20%"
                  style="padding:10px 4px;">

                  <div style="font-size:25px;">👨‍💼</div>

                  <div style="
                    color:#123f78;
                    font-size:12px;
                    line-height:1.4;
                    margin-top:7px;
                  ">
                    Expert<br>Guidance
                  </div>

                </td>


                <td align="center" width="20%"
                  style="padding:10px 4px;">

                  <div style="font-size:25px;">🎓</div>

                  <div style="
                    color:#123f78;
                    font-size:12px;
                    line-height:1.4;
                    margin-top:7px;
                  ">
                    Verified<br>Universities
                  </div>

                </td>


                <td align="center" width="20%"
                  style="padding:10px 4px;">

                  <div style="font-size:25px;">🛡️</div>

                  <div style="
                    color:#123f78;
                    font-size:12px;
                    line-height:1.4;
                    margin-top:7px;
                  ">
                    100% Free<br>Counselling
                  </div>

                </td>


                <td align="center" width="20%"
                  style="padding:10px 4px;">

                  <div style="font-size:25px;">💼</div>

                  <div style="
                    color:#123f78;
                    font-size:12px;
                    line-height:1.4;
                    margin-top:7px;
                  ">
                    Job<br>Assistance
                  </div>

                </td>


                <td align="center" width="20%"
                  style="padding:10px 4px;">

                  <div style="font-size:25px;">📈</div>

                  <div style="
                    color:#123f78;
                    font-size:12px;
                    line-height:1.4;
                    margin-top:7px;
                  ">
                    Better<br>Career Future
                  </div>

                </td>

              </tr>

            </table>

          </td>
        </tr>


        <!-- CLOSING -->
        <tr>
          <td style="
            padding:15px 38px 30px;
            color:#24466e;
          ">

            <p style="
              margin:0 0 28px;
              font-size:15px;
              line-height:1.6;
            ">
              Thank you for choosing Career Vidya for your
              education journey.
            </p>

            <p style="
              margin:0 0 5px;
              font-size:15px;
            ">
              Regards,
            </p>

            <p style="
              margin:0;
              color:#1261bd;
              font-size:19px;
              font-weight:700;
            ">
              Team Career Vidya
            </p>

            <p style="
              margin:5px 0 0;
              color:#f47721;
              font-size:14px;
              font-style:italic;
              font-weight:600;
            ">
              Vidya hai to Success hai
            </p>

          </td>
        </tr>


        <!-- FOOTER -->
        <tr>
          <td style="
            background:#123f78;
            padding:28px 25px;
          ">

            <table width="100%" cellpadding="0" cellspacing="0" border="0">

              <tr>

                <td align="center">

                  <div style="
                    color:#ffffff;
                    font-size:15px;
                    font-weight:600;
                  ">
                    🌐 careervidya.in
                  </div>

                </td>

              </tr>

              <tr>
                <td align="center" style="padding-top:12px;">

                  <div style="
                    color:#ffffff;
                    font-size:13px;
                  ">
                    Follow Us
                  </div>

                  <div style="
                    color:#ffffff;
                    font-size:14px;
                    margin-top:8px;
                  ">
                    Facebook &nbsp; • &nbsp;
                    Instagram &nbsp; • &nbsp;
                    LinkedIn &nbsp; • &nbsp;
                    YouTube
                  </div>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding-top:18px;">

                  <div style="
                    color:#ffffff;
                    font-size:14px;
                    font-style:italic;
                  ">
                    Your Trusted Education Partner
                  </div>

                </td>
              </tr>

            </table>

          </td>
        </tr>


        <!-- COPYRIGHT -->
        <tr>
          <td align="center"
            style="
              background:#ffffff;
              padding:15px;
              color:#718096;
              font-size:12px;
            ">

            © ${currentYear} Career Vidya.
            All rights reserved.

          </td>
        </tr>

      </table>

    </td>
  </tr>

</table>

</body>
</html>
  `;
};