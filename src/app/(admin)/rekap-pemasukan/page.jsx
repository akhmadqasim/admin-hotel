import { prisma } from "@/helper/prisma";
import RekapPemasukanList from "@/views/rekap-pemasukan/RekapPemasukanList";

const RekapPemasukanPage = async () => {
  const members = await prisma.member.findMany({
    include: {
      reservations: {
        include: {
          mealCost: true,
          laundryCost: true,
          otherCost: true,
        }
      },
      _count: {
        select: {reservations: true}
      }
    }
  })

  const rekapData = members.flatMap((member) =>
    member.reservations.map((reservation) => ({
      id: reservation.id,
      memberName: member.name,
      roomNumber: reservation.roomNumber,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      price: reservation.price,
      mealCost: reservation.mealCost?.map((meal) => meal.mealCost),
      laundryCost: reservation.laundryCost?.map((laundry) => laundry.laundryCost),
      otherCost: reservation.otherCost?.map((other) => other.costAmount),
      mealType: reservation.mealCost?.map((meal) => meal.mealType),
      laundryType: reservation.laundryCost?.map((laundry) => laundry.laundryType),
      otherType: reservation.otherCost?.map((other) => other.costName),
    }))
  );

  return (
    <div>
      <RekapPemasukanList data={JSON.stringify(rekapData)} />
    </div>
  );
};

export default RekapPemasukanPage;
