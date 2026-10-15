import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { token, password } = reqBody;
    if (
      typeof token !== "string" ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return NextResponse.json(
        { error: "Invalid token or password must be at least 8 characters" },
        { status: 400 },
      );
    }
    const users = await User.find({
      forgotPasswordTokenExpiry: { $gt: new Date() },
    });
    let user = null;
    //Compare token with stored bcrypt hashes
    for (const currentUser of users) {
      const isValid = await bcryptjs.compare(
        token,
        currentUser.forgotPasswordToken || "",
      );

      if (isValid) {
        user = currentUser;
        break;
      }
    }
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    //update pass
    user.password = await bcryptjs.hash(password, 10);

    //invalid resetToken
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
