// utilities/notificationService.js

import { sendEmail } from "./sendEmail.js";
import { sendSMS } from "./sendSMS.js";
import { sendWhatsApp } from "./sendWhatsApp.js";

export const sendNotification = async ({
  channels = [],
  user = {},
  type,
  data = {},
}) => {
  const tasks = [];

  // Email
  if (channels.includes("email") && user.email) {
    tasks.push(
      sendEmail({
        email: user.email,
        type,
        data,
      })
    );
  }

  // SMS
  if (channels.includes("sms") && user.phone) {
    tasks.push(
      sendSMS({
        phone: user.phone,
        type,
        data,
      })
    );
  }

  // WhatsApp
  if (channels.includes("whatsapp") && user.phone) {
    tasks.push(
      sendWhatsApp({
        phone: user.phone,
        type,
        data,
      })
    );
  }

  const results = await Promise.allSettled(tasks);

  return {
    success: true,
    results,
  };
};