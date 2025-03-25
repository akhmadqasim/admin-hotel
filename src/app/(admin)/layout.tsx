// Next
import {redirect} from "next/navigation";

// Auth
import {auth} from "@/auth";

const adminLayout = async ({children}) => {
  const session = await auth();

  if (session?.user) {
    return (
      <>
        {children}
      </>
    )
  } else {
    return redirect('/login');
  }
}

export default adminLayout;