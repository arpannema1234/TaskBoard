import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/data";
import { comparePassword, generateToken, isValidEmail } from "@/lib/auth";
import { APIResponse } from "@/types";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token (now async)
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    // Create response
    return NextResponse.json<APIResponse>({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          token,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
