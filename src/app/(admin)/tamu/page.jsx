import { prisma } from "@/helper/prisma"

import MemberList from "@/views/data-tamu/MemberList";

const DataTamuPage = async () => {
  const members = await prisma.member.findMany({
    include: {
      reservations: true,
      _count: {
        select: {reservations: true}
      }
    }
  })
  console.log(members)

  return (
    <div>
      <MemberList data={JSON.stringify(members)} />
    </div>
  );
}

export default DataTamuPage;
