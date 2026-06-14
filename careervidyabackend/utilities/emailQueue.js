import { sendToEmail } from "./sendEmail.js";
import { sendToSMS } from "./sendSMS.js";

const sendWithRetry = async (fn, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fn();
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error("Notification failed after retries:", err.message);
      } else {
        await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
      }
    }
  }
};

export const notificationQueue = {
  add: async (name, data) => {
    setImmediate(() => {
      if (data.type === "email") {
        sendWithRetry(() =>
          sendToEmail({ to: data.to, subject: data.subject, html: data.html })
        );
      } else if (data.type === "sms") {
        sendWithRetry(() => sendToSMS(data.to, data.smsText));
      }
    });
  },
};