import crypto from "crypto";
import { sendEmail } from "@/helpers/mailer";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { email } = reqBody;

    //user
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return NextResponse.json(
        {
          error: "If the email exists, a reset link will be sent",
        },
        { status: 200 },
      );
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id.toString(),
      resetToken,
    });
    return NextResponse.json({
      message: "If the email exists, a reset link will be sent",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
