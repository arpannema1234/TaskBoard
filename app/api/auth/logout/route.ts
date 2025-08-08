import { NextResponse } from "next/server";
import { APIResponse } from "@/types";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the authentication cookie using cookies from next/headers
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json<APIResponse>({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
