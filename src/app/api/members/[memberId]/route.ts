// Next
import {NextRequest, NextResponse} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
    try {
        const {memberId} = await params;

        const member = await prisma.member.findUnique({
            where: {
                id: memberId
            }
        });

        if (member) {
            return NextResponse.json({message: 'Member not found'}, {status: 404})
        }

        return NextResponse.json({member})
    } catch (e) {
        prisma.errorLog.create({
            data: {
                message: e.message,
                stack: e,
            }
        })

        return NextResponse.json({message: 'Internal server error'}, {status: 500})
    }
};

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
    try {
        const {memberId} = await params;

        const result = await prisma.member.delete({
            where: {
                id: memberId
            }
        })

        if (!result) {
            return NextResponse.json({message: 'Member not found'}, {status: 404})
        }

        return new NextResponse(null, {status: 204});
    } catch (e) {
        prisma.errorLog.create({
            data: {
                message: e.message,
                stack: e,
            }
        })

        return NextResponse.json({message: 'Internal server error'}, {status: 500})
    }
};

export const PUT = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
    try {
        const {memberId} = await params;

        const body = await req.json();

        const member = await prisma.member.update({
            where: {
                id: memberId
            },
            data: {
                nik: body.nik,
                code: body.code,
                name: body.name,
                address: body.address,
                birthDate: body.birthDate,
                birthPlace: body.birthPlace
            }
        });

        return NextResponse.json({member});
    } catch (e) {
        prisma.errorLog.create({
            data: {
                message: e.message,
                stack: e,
            }
        })

        return NextResponse.json({message: 'Internal server error'}, {status: 500})
    }
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
    try {
        const {memberId} = await params;

        const body = await req.json();

        const member = await prisma.member.update({
            where: {
                id: memberId
            },
            data: {
                ...(body.code ? {code: body.code} : {}),
                ...(body.nik ? {nik: body.nik.toString()} : {}),
                ...(body.name ? {name: body.name} : {}),
                ...(body.address ? {address: body.address} : {}),
                ...(body.birthDate ? {birthDate: new Date(body.birthDate)} : {}),
                ...(body.birthPlace ? {birthPlace: body.birthPlace} : {}),
            }
        });

        console.log("Member updated:", member);

        return NextResponse.json({member});
    } catch (e) {
        console.error("Error updating member:", e);

        prisma.errorLog.create({
            data: {
                message: e.message,
                stack: e,
            }
        })

        console.error("Error updating member:", e);

        return NextResponse.json({message: 'Internal server error'}, {status: 500})
    }
}