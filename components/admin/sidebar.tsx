import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareQuote,
  SearchCheck,
  Settings,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";

const groups = [
  {
    label: "Vue d’ensemble",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    label: "Contenus",
    items: [
      { href: "/admin/pages", label: "Pages & accueil", icon: Home },
      { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
      { href: "/admin/trainings", label: "Formations", icon: GraduationCap },
      { href: "/admin/articles", label: "Blog", icon: BookOpen },
      { href: "/admin/team", label: "Équipe", icon: Users },
      { href: "/admin/case-studies", label: "Études de cas", icon: Waypoints },
      { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
      {
        href: "/admin/testimonials",
        label: "Témoignages",
        icon: MessageSquareQuote,
      },
      { href: "/admin/media", label: "Médiathèque", icon: FolderOpen },
    ],
  },
  {
    label: "Demandes",
    items: [
      { href: "/admin/contacts", label: "Contacts", icon: Inbox },
      { href: "/admin/appointments", label: "Rendez-vous", icon: CalendarDays },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/menus", label: "Navigation", icon: Menu },
      { href: "/admin/seo", label: "SEO", icon: SearchCheck },
      { href: "/admin/settings", label: "Paramètres", icon: Settings },
      { href: "/admin/users", label: "Utilisateurs", icon: ShieldCheck },
      { href: "/admin/audit", label: "Journal d’activité", icon: FileText },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-accent p-5 text-white lg:block">
      <Link
        href="/"
        className="inline-flex p-3 text-2xl font-black tracking-[-0.06em]"
      >
        Sapiens-IA<span className="text-white">.</span>
      </Link>
      <nav className="mt-8 space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
              {group.label}
            </p>
            <div className="mt-3 space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  <item.icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="size-3 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
