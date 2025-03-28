import { prisma } from "@/helper/prisma";
import RekapPemasukanList from "@/views/rekap-pemasukan/RekapPemasukanList";

const RekapPemasukanPage = async () => {
  const members = await prisma.member.findMany({
    include: {
      reservations: true,
    },
  });

  const rekapData = members.flatMap((member) =>
    member.reservations.map((reservation) => ({
      id: reservation.id,
      memberName: member.name,
      tanggal: reservation.date,
      harga: reservation.price,
    }))
  );

  return (
    <div>
      <RekapPemasukanList data={JSON.stringify(rekapData)} />
    </div>
  );
};

export default RekapPemasukanPage;
