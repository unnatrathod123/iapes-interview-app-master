import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html }) {
  console.log("MAIL USER 👉", process.env.EMAIL_USER ? "OK" : "MISSING");
  console.log("MAIL PASS 👉", process.env.EMAIL_PASS ? "OK" : "MISSING");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true if using 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const signature = `
    <hr style="border:none;border-top:1px solid #ccc;margin:20px 0;">
     <table cellpadding="0" cellspacing="0" border="0"
  style="font-family: Arial, sans-serif; font-size:14px; color:#333;">
  <tr>

    <!-- Logo -->
    <td style="vertical-align:middle; padding-right:10px;">

      <a href="https://techstrota.com">
        <img 
          src="https://techstrota.com/images/logo/TsLogo.png"
          alt="TechStrota Logo"
          width="170"
          style="display:block; max-width:170px; height:auto;"
        />
      </a>
    </td>

    <!-- Company Details -->
    <td style="vertical-align:middle;">
      <strong style="font-size:16px;">
        <a href="https://techstrota.com" style="text-decoration:none; color:#1F6AAE;">
          TechStrota
        </a>
      </strong><br>

      <a href="https://techstrota.com" style="color:#1F6AAE; text-decoration:underline;">Website</a> |
      <a href="https://linkedin.com/company/techstrota" style="color:#1F6AAE; text-decoration:underline;">LinkedIn</a> |
      <a href="https://wa.me/918128840055" style="color:green; text-decoration:underline;">WhatsApp</a>
      <br>

      Mobile:
      <a href="tel:+918128840055" style="color:#1F6AAE; text-decoration:underline;">
        +91 8128840055
      </a>,
      Email:
      <a href="mailto:sales@techstrota.com" style="color:#1F6AAE; text-decoration:underline;">
        sales@techstrota.com
      </a>
      <br>

      CIN: GJ240114897<br>
      156, 1st Floor, K10 Atlantis, C Tower, Vadodara, Gujarat,
      <b>India</b> – 390007
    </td>

  </tr>
</table>

  `;

  const fullHtml = html + signature;


  const info = await transporter.sendMail({
    from: `"TechStrota" <${process.env.SMTP_USER}>`,
    to,
    subject:`Verify OTP for Email Confirmation`,
    html:fullHtml,
  });

  console.log("Message sent:", info.messageId);
  return info;
}
