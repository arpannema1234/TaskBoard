import { NextRequest, NextResponse } from "next/server";
import { findBoardById, createTask, getTasksByBoardId } from "@/lib/data";
import { APIResponse } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { boardId } = await params;

    if (!userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    // Check if board exists and belongs to user
    const board = findBoardById(boardId);
    if (!board) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Board not found",
        },
        { status: 404 }
      );
    }

    if (board.userId !== userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    const tasks = getTasksByBoardId(boardId);

    return NextResponse.json<APIResponse>({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { boardId } = await params;

    if (!userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    // Check if board exists and belongs to user
    const board = findBoardById(boardId);
    if (!board) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Board not found",
        },
        { status: 404 }
      );
    }

    if (board.userId !== userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    const { title, description, dueDate } = await request.json();

    // Validate input
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task title is required",
        },
        { status: 400 }
      );
    }

    if (title.trim().length > 200) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task title must be less than 200 characters",
        },
        { status: 400 }
      );
    }

    if (description && description.length > 1000) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task description must be less than 1000 characters",
        },
        { status: 400 }
      );
    }

    // Validate due date if provided
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Invalid due date format",
        },
        { status: 400 }
      );
    }

    // Create task
    const task = createTask({
      title: title.trim(),
      description: description?.trim() || undefined,
      status: "pending",
      dueDate: dueDate || undefined,
      boardId,
    });

    return NextResponse.json<APIResponse>(
      {
        success: true,
        message: "Task created successfully",
        data: { task },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
