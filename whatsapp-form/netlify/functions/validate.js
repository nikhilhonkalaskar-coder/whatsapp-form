exports.handler = async (event) => {
  try {
    const { name, mobile, email, city } = JSON.parse(event.body);

    const blocked = ["test", "demo", "abc"];
    if (blocked.includes(name.toLowerCase())) {
      return response(false, "Invalid name");
    }

    const message = `
*Tushar Bhumkar Institute Pvt Ltd  (Advanced Share Market classes)*
*Response* #10335

*Tushar Bhumkar Institute (#premium commodity शेअर मार्केट क्लासेस)*

*Full Name  :* ${name}
*Mobile Number :* ${mobile}
*Email  :* ${email}
*City :* ${city}
`;

    const whatsappLink =
      "https://wa.me/919272000111?text=" + encodeURIComponent(message);
    // ⬆️ replace XXXXXXXXXX with YOUR SALES TEAM NUMBER

    return response(true, whatsappLink);

  } catch (err) {
    return response(false, "Server error");
  }
};

function response(allowed, data) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      allowed
        ? { allowed: true, whatsapp: data }
        : { allowed: false, message: data }
    )
  };
}
