// Next
import {redirect} from "next/navigation";
import MasterLayout from "@/masterlayout/MasterLayout";

// Auth
import {auth} from "@/auth";

const adminLayout = async ({children}) => {
  const session = await auth();

  if (session?.user) {
    return (
      <>
        <MasterLayout>
          {children}
        </MasterLayout>
      </>
    )
  } else {
    return redirect('/login');
  }
}

export default adminLayout;