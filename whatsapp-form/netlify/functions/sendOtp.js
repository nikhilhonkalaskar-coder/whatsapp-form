import fetch from "node-fetch";

const OTP_STORE = global.OTP_STORE || {};
global.OTP_STORE = OTP_STORE;

export const handler = async (event) => {
  try {
    const { name, phone, email, city } = JSON.parse(event.body);

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid phone number" })
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    OTP_STORE[phone] = {
      otp,
      data: { name, phone, email, city },
      expires: Date.now() + 5 * 60 * 1000
    };

    await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.INTERAKT_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phoneNumber: "91" + phone,
        templateName: "otp_verification",
        languageCode: "en",
        bodyValues: [
          "Tushar Bhumkar Institute",
          otp.toString()
        ]
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OTP failed" })
    };
  }
};
