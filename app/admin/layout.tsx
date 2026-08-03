import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { Sidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  return (
    <div className="flex min-h-screen bg-[#f6f6f2]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/10 bg-[#f6f6f2]/90 px-5 backdrop-blur md:px-8">
          <Link href="/admin" className="font-semibold lg:hidden">
            FancyVision CMS
          </Link>
          <button className="grid size-10 place-items-center rounded-full border border-black/10 lg:hidden">
            <Menu className="size-4" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{session.user.name}</p>
              <p className="text-xs text-black/45">{session.user.role}</p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/connexion" });
              }}
            >
              <button
                className="grid size-10 place-items-center rounded-full border border-black/10 bg-white"
                aria-label="Se déconnecter"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
