document.getElementById("otp-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;

  fetch("http://localhost:3000/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "OTP sent successfully") {
        document.getElementById("email-section").style.display = "none";
        document.getElementById("otp-section").style.display = "block";
        document.getElementById("message").textContent =
          "OTP sent to your email.";
      } else {
        document.getElementById("message").textContent = "Error sending OTP.";
      }
    })
    .catch((error) => {
      document.getElementById("message").textContent = "Error: " + error;
    });
});

const otpInputs = document.querySelectorAll(".otp-box");
otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    if (e.target.value.length === 1) {
      if (index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    } else if (e.target.value.length === 0) {
      if (index > 0) {
        otpInputs[index - 1].focus();
      }
    }
  });
});

document.getElementById("verify-otp").addEventListener("click", function () {
  const otp = Array.from(otpInputs).map((input) => input.value).join("");
  const email = document.getElementById("email").value;

  fetch("http://localhost:3000/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("message").textContent =
          "OTP Verified Successfully!";
        window.location.href = "verify.html";
      } else {
        document.getElementById("message").textContent =
          "Invalid OTP. Please try again.";
      }
    })
    .catch((error) => {
      document.getElementById("message").textContent = "Error: " + error;
    });
});
