// document.getElementById("contact-form").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const form = e.target;
//   const submitBtn = form.querySelector("button");
//   submitBtn.disabled = true;
//   submitBtn.textContent = "Sending...";

//   const name = document.getElementById("name").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const message = document.getElementById("message").value.trim();

//   try {
//     const res = await fetch("/api/contact", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, message }),
//     });

//     const result = await res.text();

//     if (res.ok) {
//       alert("Message sent successfully!");
//       form.reset(); // ✅ Clear form
//     } else {
//       alert("Something went wrong: " + result);
//     }
//   } catch (err) {
//     alert("Network error. Please try again.");
//     console.error(err);
//   }

//   submitBtn.disabled = false;
//   submitBtn.textContent = "Submit"; // ✅ Reset button
// });


// const form = document.getElementById('contact-form');
// form.addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const formData = {
//         name: document.getElementById('name').value,
//         email: document.getElementById('email').value,
//         message: document.getElementById('message').value,
//     };

//     try {
//         const res = await fetch('/api/contact', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         const data = await res.json();
//         console.log(data)

//         if (res.ok) {
//             alert('Message sent successfully!');
//             form.reset();
//         } else {
//             alert('Error: ' + (data.message || 'Something went wrong'));
//         }
//     } catch (error) {
//         alert('Network Error: ' + error.message);
//     }
// });



const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, message } = req.body || {};

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const adminEmailTemplate = `
      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f4f6f8;
        color: #333;
        border-radius: 8px;
      ">
        <h2 style="color: #2c3e50;">
          New Enquiry/Feedback Received
        </h2>

        <p style="font-size: 16px;">
          You just received a message via your personal website.
          See the details below:
        </p>

        <table style="
          width: 100%;
          margin-top: 20px;
          background-color: #ffffff;
          border-collapse: collapse;
          border: 1px solid #ddd;
        ">
          <tr style="background-color: #f0f0f0;">
            <td style="
              padding: 12px;
              font-weight: bold;
              border-bottom: 1px solid #ddd;
            ">
              Name:
            </td>

            <td style="
              padding: 12px;
              border-bottom: 1px solid #ddd;
            ">
              ${escapeHtml(name)}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 12px;
              font-weight: bold;
              border-bottom: 1px solid #ddd;
            ">
              Email:
            </td>

            <td style="
              padding: 12px;
              border-bottom: 1px solid #ddd;
            ">
              ${escapeHtml(email)}
            </td>
          </tr>

          <tr style="background-color: #f0f0f0;">
            <td style="
              padding: 12px;
              font-weight: bold;
              vertical-align: top;
            ">
              Message:
            </td>

            <td style="padding: 12px;">
              ${escapeHtml(message).replace(/\n/g, "<br>")}
            </td>
          </tr>
        </table>

        <p style="
          margin-top: 30px;
          font-size: 14px;
          color: #888;
        ">
          Please respond as soon as possible.
        </p>

        <p style="
          margin-top: 20px;
          font-size: 14px;
          color: #aaa;
        ">
          This is an automated message generated from your personal site.
        </p>
      </div>
    `;

    const emailTemplate = `
      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        color: #333;
        background-color: #f9f9f9;
        border-radius: 8px;
      ">
        <h2 style="color: #2c3e50;">
          Thank You for Your Message
        </h2>

        <p style="font-size: 16px;">
          Hi ${escapeHtml(name)},
        </p>

        <p style="font-size: 16px;">
          I've received your enquiry/feedback and truly appreciate
          you taking the time to reach out.
          Below is a copy of your message:
        </p>

        <div style="
          background-color: #fff;
          padding: 15px;
          margin: 20px 0;
          border: 1px solid #eee;
          border-radius: 5px;
        ">
          <p style="
            font-size: 14px;
            line-height: 1.6;
            color: #555;
          ">
            ${escapeHtml(message).replace(/\n/g, "<br>")}
          </p>
        </div>

        <p style="font-size: 16px;">
          I'll review your message and respond as soon as possible —
          usually within <strong>24–48 hours</strong>.
        </p>

        <p style="
          font-size: 16px;
          margin-top: 30px;
        ">
          Regards,<br>
          <strong>Olorunfemi Akanbi</strong>
        </p>

        <p style="
          margin-top: 40px;
          font-size: 14px;
          color: #aaa;
        ">
          This email was automatically sent in response to your
          message on my website.
        </p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS,
      },
    });

    // Send enquiry to you
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Website Enquiry from ${name}`,
      html: adminEmailTemplate,
    });

    // Send confirmation to visitor
    await transporter.sendMail({
      from: `"Olorunfemi Akanbi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Olorunfemi Akanbi",
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("Mail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};


// Basic HTML escaping to prevent injected HTML
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
