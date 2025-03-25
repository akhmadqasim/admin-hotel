// Next
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

// Auth
import {auth} from "@/auth";

export const middleware = async (req: NextRequest) => {
  // if (req.method === "GET") {
  //   return;
  // }

  const session = await auth();

  console.log(session?.user);

  if (!session) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }
}

export const config = {
  matcher: ['/api/members', '/api/members/:path*']
}