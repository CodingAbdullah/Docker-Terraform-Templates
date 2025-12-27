import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

// Reading and Creating users
export async function GET() {
  try {
    const allUsers = await db.select().from(users);

    return NextResponse.json({
      success: true,
      data: allUsers,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const newUser = await db.insert(users).values({
      name,
      email,
    }).returning();

    return NextResponse.json(
      {
        success: true,
        data: newUser[0],
        error: null,
      },
      { status: 201 }
    );
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
        error: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
