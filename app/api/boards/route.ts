import { NextRequest, NextResponse } from "next/server";
import { createBoard, getBoardsByUserId } from "@/lib/data";
import { APIResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    const boards = getBoardsByUserId(userId);

    return NextResponse.json<APIResponse>({
      success: true,
      data: { boards },
    });
  } catch (error) {
    console.error("Get boards error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Board name is required",
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Board name must be less than 100 characters",
        },
        { status: 400 }
      );
    }

    // Create board
    const board = createBoard({
      name: name.trim(),
      userId,
    });

    return NextResponse.json<APIResponse>(
      {
        success: true,
        message: "Board created successfully",
        data: { board },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create board error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
