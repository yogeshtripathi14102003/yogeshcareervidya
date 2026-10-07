// import twilio from "twilio";

// const accountSid = process.env.TWILIO_SID;
// const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE;

// const client = twilio(accountSid, twilioAuthToken);


// export const sendToSMS = async (phoneNumber, generatedCode) => {
//   await client.messages.create({
//     body: `Your password reset code is ${generatedCode}`,
//     to: phoneNumber,
//     from: twilioPhone,
//   });
// };

// utilities/sendSMS.js

const SMS_API_URL = process.env.SMS_API_URL;
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;

export const sendSMS = async ({
  phone,
  type,
  data = {},
}) => {
  try {
    if (!SMS_API_URL || !SMS_API_KEY) {
      console.warn(
        "SMS provider is not configured. SMS skipped."
      );

      return {
        success: false,
        skipped: true,
        channel: "sms",
      };
    }

    const message = getSMSMessage(type, data);

    const response = await fetch(SMS_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMS_API_KEY}`,
      },

      body: JSON.stringify({
        to: phone,
        sender: SMS_SENDER_ID,
        message,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result?.message ||
          result?.error ||
          `SMS API failed with status ${response.status}`
      );
    }

    return {
      success: true,
      channel: "sms",
      phone,
      result,
    };
  } catch (error) {
    console.error("SMS Error:", error);

    return {
      success: false,
      channel: "sms",
      error: error.message,
    };
  }
};

const getSMSMessage = (type, data) => {
  switch (type) {
    case "LOGIN_OTP":
      return `Your CareerVidya login OTP is ${data.otp}. Do not share this OTP with anyone.`;

    case "SIGNUP_OTP":
      return `Your CareerVidya verification OTP is ${data.otp}. Do not share this OTP with anyone.`;

    case "PASSWORD_RESET":
      return `Your CareerVidya password reset OTP is ${data.otp}.`;

    case "COURSE_ENQUIRY":
      return `CareerVidya: Your course enquiry has been received successfully.`;

    case "APPLICATION_UPDATE":
      return `CareerVidya: Your application status has been updated.`;

    default:
      return data.message || "CareerVidya notification.";
  }
};