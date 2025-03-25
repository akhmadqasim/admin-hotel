// Components
import {signOut} from "@/auth";

const Page = async () => {
  return (
    <>
      <h1>Dashboard</h1>
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
