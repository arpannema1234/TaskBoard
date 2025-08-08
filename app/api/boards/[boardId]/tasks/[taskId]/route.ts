import { NextRequest, NextResponse } from "next/server";
import {
  findBoardById,
  findTaskById,
  updateTask,
  deleteTask,
} from "@/lib/data";
import { APIResponse } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; taskId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { boardId, taskId } = await params;

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

    // Check if task exists and belongs to the board
    const existingTask = findTaskById(taskId);
    if (!existingTask) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    if (existingTask.boardId !== boardId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task does not belong to this board",
        },
        { status: 403 }
      );
    }

    const { title, description, status, dueDate } = await request.json();

    // Validate input
    if (title !== undefined) {
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
    }

    if (description !== undefined && description.length > 1000) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task description must be less than 1000 characters",
        },
        { status: 400 }
      );
    }

    if (status !== undefined && !["pending", "completed"].includes(status)) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: 'Invalid status. Must be "pending" or "completed"',
        },
        { status: 400 }
      );
    }

    // Validate due date if provided
    if (
      dueDate !== undefined &&
      dueDate !== null &&
      isNaN(Date.parse(dueDate))
    ) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Invalid due date format",
        },
        { status: 400 }
      );
    }

    // Prepare updates
    const updates: any = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined)
      updates.description = description?.trim() || undefined;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate || undefined;

    // Update task
    const updatedTask = updateTask(taskId, updates);

    return NextResponse.json<APIResponse>({
      success: true,
      message: "Task updated successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Update task error:", error);
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
  { params }: { params: Promise<{ boardId: string; taskId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { boardId, taskId } = await params;

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

    // Check if task exists and belongs to the board
    const existingTask = findTaskById(taskId);
    if (!existingTask) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    if (existingTask.boardId !== boardId) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Task does not belong to this board",
        },
        { status: 403 }
      );
    }

    // Delete task
    const deleted = deleteTask(taskId);

    if (!deleted) {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          error: "Failed to delete task",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<APIResponse>({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
