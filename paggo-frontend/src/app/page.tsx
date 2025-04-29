import { Chat } from "@/components/chat";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Chat session={session} />
    </>
  );
};

export default Page;