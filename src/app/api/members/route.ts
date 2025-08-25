// Next
import {NextResponse, NextRequest} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const memberSchema = v.object({
    nik: v.optional(v.string()),
    code: v.string(),
    address: v.optional(v.string()),
    name: v.string(),
    birthDate: v.optional(v.date()),
    birthPlace: v.optional(v.string())
});

export const GET = async () => {
    try {
        const members = await prisma.member.findMany();

        return NextResponse.json({
            members
        })
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

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const data = v.parse(memberSchema, {
            code: body.code,
            name: body.name,
            ...(body.nik ? {nik: body.nik} : {}),
            ...(body.birthPlace ? {birthPlace: body.birthPlace} : {}),
            ...(body.birthDate ? {birthDate: new Date(body.birthDate)} : {}),
            ...(body.address ? {address: body.address} : {})
        })

        const member = await prisma.member.create({
            data
        });

        return NextResponse.json({
            member
        })
    } catch (e) {
        prisma.errorLog.create({
            data: {
                message: e.message,
                stack: e,
            }
        })

        return NextResponse.json({message: "Invalid data"}, {status: 400})
    }
}