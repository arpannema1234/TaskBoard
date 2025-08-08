import { NextRequest, NextResponse } from "next/server";
import { findBoardById, updateBoard, deleteBoard } from "@/lib/data";
import { APIResponse } from "@/types";

export async function PUT(
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
    const existingBoard = findBoardById(boardId);
    if (!existingBoard) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Board not found",
        },
        { status: 404 }
      );
    }

    if (existingBoard.userId !== userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
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

    // Update board
    const updatedBoard = updateBoard(boardId, { name: name.trim() });

    return NextResponse.json<APIResponse>({
      success: true,
      message: "Board updated successfully",
      data: { board: updatedBoard },
    });
  } catch (error) {
    console.error("Update board error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const existingBoard = findBoardById(boardId);
    if (!existingBoard) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Board not found",
        },
        { status: 404 }
      );
    }

    if (existingBoard.userId !== userId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Access denied",
        },
        { status: 403 }
      );
    }

    // Delete board (and all its tasks)
    const deleted = deleteBoard(boardId);

    if (!deleted) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Failed to delete board",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIResponse>({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (error) {
    console.error("Delete board error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
