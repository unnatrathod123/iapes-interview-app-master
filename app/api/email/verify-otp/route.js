import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    const [rows] = await pool.execute(
      `SELECT * FROM email_verifications
       WHERE email = ? AND otp = ? AND expires_at > NOW()`,
      [email, otp]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await pool.execute(
      `UPDATE email_verifications
       SET verified = 1, otp = NULL
       WHERE email = ?`,
      [email]
    );

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
