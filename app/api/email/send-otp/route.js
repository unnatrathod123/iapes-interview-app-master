import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import pool, { getEmailVerification } from "@/lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();
     

   

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if email already exists & verified
    const record = await getEmailVerification(email);

    if (record && record.verified === 1) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
      });
    }


      // const record = await getEmailVerification(email);

      // if (record?.verified === 1) {
      //   return NextResponse.json({
      //     success: true,
      //     alreadyVerified: true,
      //   });
      // }


    // 2️⃣ Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // 3️⃣ Store / update OTP
    await pool.execute(
      `
      REPLACE INTO email_verifications
      (email, otp, expires_at, verified)
      VALUES (?, ?, ?, 0)
      `,
      [email, otp, expiresAt]
    );

    // 4️⃣ Send OTP email
    await sendMail({
      to: email,
      subject: "Verify your email",
      html: 
      `
        <h3>Email Verification</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>Valid for 5 minutes</p>
      `,
   
    });

    return NextResponse.json({ success: true });
  } catch (err) {
     console.error("MAIL ERROR 👉", err.message, err);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
