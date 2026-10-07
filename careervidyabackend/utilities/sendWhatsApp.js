// utilities/sendWhatsApp.js

const WHATSAPP_API_URL =
  process.env.WHATSAPP_API_URL;

const WHATSAPP_ACCESS_TOKEN =
  process.env.WHATSAPP_ACCESS_TOKEN;

const WHATSAPP_PHONE_NUMBER_ID =
  process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendWhatsApp = async ({
  phone,
  type,
  data = {},
}) => {
  try {
    if (
      !WHATSAPP_API_URL ||
      !WHATSAPP_ACCESS_TOKEN
    ) {
      console.warn(
        "WhatsApp provider is not configured. WhatsApp skipped."
      );

      return {
        success: false,
        skipped: true,
        channel: "whatsapp",
      };
    }

    const template = getWhatsAppTemplate(
      type,
      data
    );

    const response = await fetch(
      WHATSAPP_API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },

        body: JSON.stringify({
          phone,
          phoneNumberId:
            WHATSAPP_PHONE_NUMBER_ID,

          template: template.name,

          variables:
            template.variables,
        }),
      }
    );

    const result = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result?.message ||
          result?.error ||
          `WhatsApp API failed with status ${response.status}`
      );
    }

    return {
      success: true,
      channel: "whatsapp",
      phone,
      result,
    };
  } catch (error) {
    console.error(
      "WhatsApp Error:",
      error
    );

    return {
      success: false,
      channel: "whatsapp",
      error: error.message,
    };
  }
};

const getWhatsAppTemplate = (
  type,
  data
) => {
  switch (type) {
    case "LOGIN_OTP":
      return {
        name: "login_otp",
        variables: [
          String(data.otp),
        ],
      };

    case "SIGNUP_OTP":
      return {
        name: "signup_otp",
        variables: [
          String(data.otp),
        ],
      };

    case "PASSWORD_RESET":
      return {
        name: "password_reset_otp",
        variables: [
          String(data.otp),
        ],
      };

    case "COURSE_ENQUIRY":
      return {
        name: "course_enquiry",
        variables: [],
      };

    case "APPLICATION_UPDATE":
      return {
        name: "application_update",
        variables: [],
      };

    default:
      return {
        name: "general_notification",
        variables: [
          data.message || "",
        ],
      };
  }
};