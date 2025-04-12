// Next
import {NextRequest, NextResponse} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const reservationSchema = v.object({
    memberId: v.string(),
    beginDate: v.optional(v.date()),
    endDate: v.optional(v.date()),
    roomNumber: v.optional(v.string()),
    price: v.optional(v.number()),
    mealCost: v.optional(v.number()),
    laundryCost: v.optional(v.number()),
    otherCost: v.optional(v.number()),
});

const reservationSchemaPatch = v.object({
    memberId: v.optional(v.string()),
    beginDate: v.optional(v.date()),
    endDate: v.optional(v.date()),
    roomNumber: v.optional(v.string()),
    price: v.optional(v.number()),
    mealCost: v.optional(v.number()),
    laundryCost: v.optional(v.number()),
    otherCost: v.optional(v.number()),
});

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
    const {reservationId} = await params;

    const reservation = await prisma.reservation.findUnique({
        where: {
            id: reservationId
        }
    });

    if (!reservation) {
        return NextResponse.json({message: 'Reservation not found'}, {status: 404})
    }

    return NextResponse.json({reservation})
}

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
    const {reservationId} = await params;

    const result = await prisma.reservation.delete({
        where: {
            id: reservationId
        }
    })

    if (!result) {
        return NextResponse.json({message: 'Reservation not found'}, {status: 404})
    }

    return new NextResponse(null, {status: 204});
};

export const PUT = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
    try {
        const {reservationId} = await params;

        const body = await req.json();

        const data = v.parse(reservationSchema, {
            memberId: body.memberId,
            ...(body.beginDate ? {beginDate: new Date(body.beginDate)} : {}),
            ...(body.endDate ? {endDate: new Date(body.endDate)} : {}),
            ...(body.roomNumber ? {roomNumber: body.roomNumber} : {}),
            ...(body.price ? {price: body.price} : {}),
            ...(body.mealCost ? {mealCost: body.mealCost} : {}),
            ...(body.laundryCost ? {laundryCost: body.laundryCost} : {}),
            ...(body.otherCost ? {otherCost: body.otherCost} : {}),
        });

        const reservation = await prisma.reservation.update({
            where: {
                id: reservationId
            },
            data
        });

        return NextResponse.json({reservation});
    } catch (e) {
        return NextResponse.json({message: "Invalid data"}, {status: 400});
    }
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
    try {
        const {reservationId} = await params;

        const body = await req.json();

        const data = v.parse(reservationSchemaPatch, {
            ...(body.memberId ? {memberId: body.memberId} : {}),
            ...(body.beginDate ? {beginDate: new Date(body.beginDate)} : {}),
            ...(body.endDate ? {endDate: new Date(body.endDate)} : {}),
            ...(body.roomNumber ? {roomNumber: body.roomNumber} : {}),
            ...(body.price ? {price: body.price} : {}),
            ...(body.mealCost ? {mealCost: body.mealCost} : {}),
            ...(body.laundryCost ? {laundryCost: body.laundryCost} : {}),
            ...(body.otherCost ? {otherCost: body.otherCost} : {}),
        });

        const reservation = await prisma.reservation.update({
            where: {
                id: reservationId
            },
            data
        });

        return NextResponse.json({reservation});
    } catch (e) {
        return NextResponse.json({message: "Invalid data"}, {status: 400});
    }
}