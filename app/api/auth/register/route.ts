import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/data";
import {
  hashPassword,
  generateToken,
  isValidEmail,
  isValidPassword,
} from "@/lib/auth";
import { APIResponse } from "@/types";

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

    if (!isValidPassword(password)) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = createUser({
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Create response with HTTP-only cookie
    const response = NextResponse.json<APIResponse>({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
