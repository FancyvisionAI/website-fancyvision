import {
  Activity,
  BookOpen,
  CalendarDays,
  Inbox,
  Mail,
  Sparkles,
} from "lucide-react";

import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminHome() {
  const [articles, contacts, appointments, subscribers, services, recent] =
    await Promise.all([
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.contactRequest.count({ where: { status: "NEW" } }),
      db.appointment.count({ where: { status: "NEW" } }),
      db.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
      db.service.count({ where: { status: "PUBLISHED" } }),
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: true },
      }),
    ]);
  const stats = [
    {
      label: "Articles publiés",
      value: articles,
      icon: BookOpen,
      color: "bg-cobalt text-white",
    },
    {
      label: "Nouveaux contacts",
      value: contacts,
      icon: Inbox,
      color: "bg-lime",
    },
    {
      label: "Rendez-vous à traiter",
      value: appointments,
      icon: CalendarDays,
      color: "bg-white",
    },
    {
      label: "Abonnés newsletter",
      value: subscribers,
      icon: Mail,
      color: "bg-white",
    },
  ];
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-black/45">Vue d’ensemble</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
            Bonjour, l’équipe.
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-black/55">
          <Sparkles className="size-4 text-cobalt" />
          {services} expertises en ligne
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-3xl p-6 ${stat.color}`}>
            <stat.icon className="size-5" />
            <p className="mt-10 text-4xl font-semibold tracking-[-0.06em]">
              {stat.value}
            </p>
            <p className="mt-2 text-sm opacity-60">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <section className="rounded-3xl bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Activité récente</h2>
            <Activity className="size-4 text-black/40" />
          </div>
          <div className="mt-6 divide-y divide-black/10">
            {recent.length ? (
              recent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 text-sm"
                >
                  <span className="ring-lime/20 size-2 rounded-full bg-lime ring-4" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.action} · {item.entity}
                    </p>
                    <p className="text-xs text-black/40">
                      {item.user?.name ?? "Système"}
                    </p>
                  </div>
                  <time className="text-xs text-black/40">
                    {formatDate(item.createdAt)}
                  </time>
                </div>
              ))
            ) : (
              <p className="py-8 text-sm text-black/40">
                Le journal se remplira dès la première modification.
              </p>
            )}
          </div>
        </section>
        <section className="rounded-3xl bg-ink p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">
            Trafic
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
            Connectez votre outil analytics.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/50">
            Ajoutez vos identifiants dans Paramètres pour afficher les sessions,
            sources et conversions.
          </p>
          <div className="mt-10 flex h-28 items-end gap-2">
            {[35, 55, 42, 75, 60, 90, 72, 100, 82].map((h, index) => (
              <span
                key={index}
                className="bg-lime/70 flex-1 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
