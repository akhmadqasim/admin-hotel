import { prisma } from "@/helper/prisma";
import EditReservationList from "@/views/data-reservasi/EditReservationList";

const EditReservasiPage = async ({ params }) => {

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id},
    include: {
      bookingPrice: true,
      mealCost: true,
      laundryCost: true,
      otherCost: true,
      member: true,
    },
  });

  return (
    <div>
      <EditReservationList reservation={reservation} />
    </div>
  );
};

export default EditReservasiPage;
