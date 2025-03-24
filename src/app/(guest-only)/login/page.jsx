// Next
import {redirect} from "next/navigation";

// Components
import {auth} from "@/auth";

// Views
import Login from "@/views/auth/Login";

const Page = async () => {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }

  return <Login/>;
};

export default Page;
