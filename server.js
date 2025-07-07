const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/contact") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const { name, email, message } = JSON.parse(body);

      const adminEmailTemplate = `
        <div style="font-family: 'Arial', sans-serif; padding: 20px; background-color: #f4f6f8; color: #333; border-radius: 8px;">
            <h2 style="color: #2c3e50;">New Enquiry/Feedback Received</h2>
            
            <p style="font-size: 16px;">You just received a message via your personal website. See the details below:</p>

            <table style="width: 100%; margin-top: 20px; background-color: #ffffff; border-collapse: collapse; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
            <tr style="background-color: #f0f0f0;">
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Name:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${email}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
                <td style="padding: 12px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 12px;">${message}</td>
            </tr>
            </table>

            <p style="margin-top: 30px; font-size: 14px; color: #888;">Please respond as soon as possible.</p>
            <p style="margin-top: 20px; font-size: 14px; color: #aaa;">This is an automated message generated from your personal site.</p>
        </div>
        `;

      const emailTemplate = `
        <div style="font-family: 'Arial', sans-serif; padding: 20px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #2c3e50;">Thank You for Your Message</h2>
          
          <p style="font-size: 16px;">Hi ${name},</p>
      
          <p style="font-size: 16px;">
            I’ve received your enquiry/feedback and truly appreciate you taking the time to reach out.
            Below is a copy of your message:
          </p>
      
          <div style="background-color: #fff; padding: 15px; margin: 20px 0; border: 1px solid #eee; border-radius: 5px;">
            <p style="font-size: 14px; line-height: 1.6; color: #555;">${message}</p>
          </div>
      
          <p style="font-size: 16px;">I'll review your message and respond as soon as possible — usually within <strong>24–48 hours</strong>.</p>
      
          <p style="font-size: 16px; margin-top: 30px;">Regards,<br/><strong>Olorunfemi Akanbi</strong></p>
      
          <p style="margin-top: 40px; font-size: 14px; color: #aaa;">This email was automatically sent in response to your message on my website.</p>
        </div>
      `;

      const transporter = require("nodemailer").createTransport({
        service: "Gmail",
        auth: {
          user: "akanbi398@gmail.com",
          pass: process.env.APP_PASS,
        },
      });

      try {
        // Send to Admin
        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to: "akanbi398@gmail.com", // Admin (Olorunfemi Akanbi)
          subject: "New Website Enquiry/Feedback",
          html: adminEmailTemplate,
        });

        await transporter.sendMail({
          from: `"Olorunfemi Akanbi" <akanbi398@gmail.com>`,
          to: email,
          subject: "Thank you for contacting Olorunfemi Akanbi",
          html: emailTemplate,
        });

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Message sent successfully!");
      } catch (err) {
        console.error("Mail Error:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Failed to send message.");
      }
    });

    return;
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  let ext = path.extname(filePath);

  let contentType = "text/html";
  switch (ext) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
