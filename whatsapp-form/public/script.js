const form = document.getElementById("leadForm");
const otpBox = document.getElementById("otpBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  await fetch("/.netlify/functions/sendOtp", {
    method: "POST",
    body: JSON.stringify(data)
  });

  otpBox.style.display = "block";
});

async function verifyOtp() {
  const phone = document.querySelector("[name=phone]").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch("/.netlify/functions/verifyOtp", {
    method: "POST",
    body: JSON.stringify({ phone, otp })
  });

  const json = await res.json();
  if (json.verified) {
    alert("Verified Successfully ✅");
  }
}
