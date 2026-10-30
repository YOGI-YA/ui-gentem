import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const OTP_SECRET =
  process.env.OTP_SECRET || process.env.SMTP_PASS || "yogiya-contact-verification-secret-key";
const EXPIRATION_TIME_MS = 10 * 60 * 1000; // 10 minutes

function generateToken(email: string, code: string, expiresAt: number): string {
  const data = `${email.toLowerCase().trim()}:${code}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", OTP_SECRET).update(data).digest("hex");
  return `${expiresAt}.${hmac}`;
}

function verifyToken(email: string, code: string, token: string): boolean {
  try {
    const [expiresAtStr, hash] = token.split(".");
    const expiresAt = Number(expiresAtStr);
    if (!expiresAt || isNaN(expiresAt) || !hash) return false;
    if (Date.now() > expiresAt) return false;

    const data = `${email.toLowerCase().trim()}:${code.trim()}:${expiresAt}`;
    const expectedHash = crypto.createHmac("sha256", OTP_SECRET).update(data).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth:
      user && pass
        ? {
            user,
            pass,
          }
        : undefined,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || "submit";

    // -------------------------------------------------------------
    // ACTION 1: SEND VERIFICATION CODE (OTP)
    // -------------------------------------------------------------
    if (action === "send-code") {
      const { name, email } = body;

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        !name.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        name.length > 50 ||
        email.length > 80
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid name and email address.",
          },
          { status: 400 }
        );
      }

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + EXPIRATION_TIME_MS;
      const token = generateToken(email, code, expiresAt);

      const hasSmtpConfig = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

      if (hasSmtpConfig) {
        const transporter = getTransporter();
        await transporter.sendMail({
          from: `"Yogender Verma" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          subject: `${code} is your YOGI-YA verification code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #f5f3ef; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;">
              <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #ffffff;">Email Verification</h2>
              <p style="font-size: 14px; color: #8e8e8e; line-height: 1.6; margin-top: 0;">
                Hi ${name.trim()}, please enter this 6-digit verification code to confirm your email and deliver your message:
              </p>
              <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${code}</span>
              </div>
              <p style="font-size: 12px; color: #8e8e8e; line-height: 1.5;">
                This code will expire in <strong>10 minutes</strong>. If you did not request this, please disregard this email.
              </p>
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); margin-top: 24px; padding-top: 16px; font-size: 11px; color: #555555;">
                Sent from Yogender Verma Portfolio — YOGI-YA
              </div>
            </div>
          `,
        });
      } else {
        // Fallback for development if SMTP_PASS is not configured yet
        console.warn("\n================================================");
        console.warn(`[DEV MODE] Verification Code for ${email.trim()}: ${code}`);
        console.warn("Set SMTP_USER and SMTP_PASS in .env to deliver real emails.");
        console.warn("================================================\n");
      }

      return NextResponse.json({
        success: true,
        message: hasSmtpConfig
          ? "Verification code sent to your email."
          : "Verification code generated (check server console in dev mode).",
        token,
        // In local development without SMTP_PASS, provide devCode hint so developer can test immediately
        devCode: !hasSmtpConfig ? code : undefined,
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: VERIFY CODE & DELIVER CONTACT MESSAGE
    // -------------------------------------------------------------
    if (action === "verify-and-send" || action === "submit") {
      const { name, email, message, code, token } = body;

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string" ||
        !name.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        !message.trim() ||
        name.length > 50 ||
        email.length > 80 ||
        message.length > 1000
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Please fill out all fields with valid information.",
          },
          { status: 400 }
        );
      }

      // Verify OTP code
      if (!code || !token || typeof code !== "string" || typeof token !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Verification code and token are required.",
          },
          { status: 400 }
        );
      }

      const isValid = verifyToken(email, code, token);
      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired verification code. Please request a new code.",
          },
          { status: 400 }
        );
      }

      const hasSmtpConfig = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
      const receiverEmail =
        process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || "yogender.tech@gmail.com";

      if (hasSmtpConfig) {
        const transporter = getTransporter();

        // 1. Send the verified inquiry to website owner
        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
          to: receiverEmail,
          replyTo: email.trim(),
          subject: `✨ New Inquiry from ${name.trim()} [Verified]`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #f5f3ef; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 4px 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
                  ✓ Verified Email
                </span>
                <span style="font-size: 12px; color: #8e8e8e;">${new Date().toLocaleString()}</span>
              </div>
              <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px 0; color: #ffffff;">New Portfolio Inquiry</h2>
              <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #8e8e8e;">From:</strong> <span style="color: #ffffff;">${name.trim()}</span></p>
                <p style="margin: 0; font-size: 14px;"><strong style="color: #8e8e8e;">Email:</strong> <a href="mailto:${email.trim()}" style="color: #ffffff; text-decoration: underline;">${email.trim()}</a></p>
              </div>
              <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 20px;">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8e8e8e; margin-bottom: 8px;">Message:</div>
                <div style="font-size: 15px; line-height: 1.6; color: #f5f3ef; white-space: pre-wrap;">${message.trim()}</div>
              </div>
            </div>
          `,
        });

        // 2. Send friendly confirmation back to sender
        await transporter.sendMail({
          from: `"Yogender Verma" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          subject: `Thanks for reaching out, ${name.trim()}!`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #f5f3ef; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px;">
              <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 12px; color: #ffffff;">Message Received</h2>
              <p style="font-size: 14px; color: #8e8e8e; line-height: 1.6;">
                Hi ${name.trim()}, thank you for getting in touch. I have received your message and will review it and get back to you shortly.
              </p>
              <div style="background: #141414; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #cccccc; font-style: italic;">
                "${message.trim().slice(0, 150)}${message.length > 150 ? "..." : ""}"
              </div>
              <p style="font-size: 13px; color: #8e8e8e; margin-bottom: 0;">
                Best regards,<br /><strong style="color: #ffffff;">Yogender Verma</strong>
              </p>
            </div>
          `,
        });
      } else {
        console.log("\n================================================");
        console.log(`[DEV MODE] Verified contact message received from ${name} (${email}):`);
        console.log(`Message: ${message}`);
        console.log("================================================\n");
      }

      return NextResponse.json({
        success: true,
        message: "Your message has been verified and sent successfully!",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action specified.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing contact request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}