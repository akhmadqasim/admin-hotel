import { prisma } from "@/helper/prisma"
import ReservasiList from "@/views/data-reservasi/ReservasiList";

const DataReservasiPage = async () => {
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

  return (
    <div>
       <ReservasiList data={JSON.stringify(members)}/>
    </div>
  );
}

export default DataReservasiPage;
