import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 400 })
    }
    try {

        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        const courses = await prisma.course.findMany({
            where: {
                instructorId: user.id
            }, orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json({
            success: true,
            message: "Courses Fetched Successfully",
            courses
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error while Geting user Courses",
            error
        }, { status: 500 })
    }
}