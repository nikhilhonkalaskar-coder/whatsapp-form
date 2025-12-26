import fetch from "node-fetch";

const OTP_STORE = global.OTP_STORE || {};
global.OTP_STORE = OTP_STORE;

let RESPONSE_NO = global.RESPONSE_NO || 10335;
global.RESPONSE_NO = RESPONSE_NO;

export const handler = async (event) => {
  try {
    const { phone, otp } = JSON.parse(event.body);
    const record = OTP_STORE[phone];

    if (!record)
      return { statusCode: 400, body: "OTP not found" };

    if (record.otp != otp)
      return { statusCode: 400, body: "Wrong OTP" };

    if (Date.now() > record.expires)
      return { statusCode: 400, body: "OTP expired" };

    global.RESPONSE_NO++;
    RESPONSE_NO = global.RESPONSE_NO;

    const msg = `*Tushar Bhumkar Institute Pvt Ltd*
*Response* #${RESPONSE_NO}

*Full Name:* ${record.data.name}
*Mobile Number:* ${record.data.phone}
*Email:* ${record.data.email}
*City:* ${record.data.city}`;

    await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.INTERAKT_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phoneNumber: process.env.SALES_NUMBER,
        type: "text",
        text: msg
      })
    });

    delete OTP_STORE[phone];

    return {
      statusCode: 200,
      body: JSON.stringify({ verified: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Verification failed" })
    };
  }
};
