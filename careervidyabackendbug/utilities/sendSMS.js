import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, twilioAuthToken);


export const sendToSMS = async (phoneNumber, generatedCode) => {
  await client.messages.create({
    body: `Your password reset code is ${generatedCode}`,
    to: phoneNumber,
    from: twilioPhone,
  });
};
