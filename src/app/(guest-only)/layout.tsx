// Next
import {redirect} from "next/navigation";

// Auth
import {auth} from "@/auth";

const adminLayout = async ({children}) => {
  const session = await auth();

  if (session?.user) {
    return redirect('/');
  } else {
    return (
      <>
        {children}
      </>
    )
  }
}

export default adminLayout;