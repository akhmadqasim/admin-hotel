// Next
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

// Auth
import {auth} from "@/auth";

export const middleware = async (req: NextRequest) => {
    const session = await auth();

  if (!session) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }
}

export const config = {
  matcher: ['/api/members', '/api/members/:path*']
}