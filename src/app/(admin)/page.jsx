// Next
import {redirect} from "next/navigation";

// Components
import {auth, signOut} from "@/auth";

const Page = async () => {
  const session = await auth();

  if (!session?.user) {
    return redirect('/login')
  }

  return (
    <>
      <h1>Lah</h1>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  )
};

export default Page;
