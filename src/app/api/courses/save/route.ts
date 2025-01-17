import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const { userId, courseId } = await request.json();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email,
                role: "USER"
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        await prisma.savedCourses.create({
            data: {
                userId: userId,
                courseId: courseId
            }
        });

        return NextResponse.json({
            success: true,
            message: "Course saved successfully",
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Server error during saving course",
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { courseId } = await request.json();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email,
                role: "USER"
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        await prisma.savedCourses.delete({
            where: {
                courseId_userId: {
                    userId: user.id,
                    courseId:courseId
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "Course unsaved successfully",
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Server error during unsaving course",
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email,
                role: "USER"
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        const savedCourses = await prisma.savedCourses.findMany({
            where: {
                userId: user.id
            },
            select: {
                course: true
            }
        });

        return NextResponse.json({
            savedCourses
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Server error during fetching saved courses",
            error: error.message
        }, { status: 500 });
    }
}