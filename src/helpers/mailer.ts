import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
  resetToken,
}: any) => {
  try {
    //create hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: await bcryptjs.hash(resetToken, 10),
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${resetToken}`;
    const mailOptions = {
      from: {
        name: "My App",
        address: "hello@demomailtrap.co",
      },
      to: email,
      subject:
        emailType === "VERIFY" ? "verify your email" : "Reset your password",
      html: `
    <p>
      Click <a href="${link}">here</a> to
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
      <br />
      Or copy and paste the link below into your browser:
      <br />
      <a href="${link}">${link}</a>
    </p>
  `,
    };
    const mailRespose = await transporter.sendMail(mailOptions);
    return mailRespose;
  } catch (error: any) {
    console.error("Email sending failed:", error);
    throw new Error(error.message || "Failed to send email");
  }
};
