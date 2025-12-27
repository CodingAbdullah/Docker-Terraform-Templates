import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Updating and Deleting Users
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Name and email are required",
        },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid input types",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const updatedUser = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedUser[0],
      error: null,
    });
  } catch (error: unknown) {

    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Email already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Failed to update user",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Failed to delete user",
      },
      { status: 500 }
    );
  }
}
