import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Chatbot } from "@/components/chatbot";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full relative overflow-x-hidden">
      <div className="hidden xl:block w-72 shrink-0 border-r border-border/10">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <MobileNav />
        <main className="flex-1 w-full p-2 md:p-6 lg:p-8">
          {children}
        </main>
        <Chatbot />
      </div>
    </div>
  );
}
