// Next
import {NextRequest, NextResponse} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const reservationSchemaPatch = v.object({
    memberId: v.optional(v.string()),
    checkIn: v.optional(v.date()),
    checkOut: v.optional(v.date()),
    roomNumber: v.optional(v.string()),
    price: v.optional(v.number()),
});

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
    const {reservationId} = await params;

    const reservation = await prisma.reservation.findUnique({
        where: {
            id: reservationId
        },
        include: {
            mealCost: true,
            laundryCost: true,
            otherCost: true,
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

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
    try {
        const {reservationId} = await params;

        const body = await req.json();

        const data = v.parse(reservationSchemaPatch, {
            ...(body.memberId ? {memberId: body.memberId} : {}),
            ...(body.checkIn ? {checkIn: new Date(body.checkIn)} : {}),
            ...(body.checkOut ? {checkOut: new Date(body.checkOut)} : {}),
            ...(body.roomNumber ? {roomNumber: body.roomNumber} : {}),
            ...(body.price ? {price: body.price} : {}),
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