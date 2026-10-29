import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";
import { DashboardNav, type NavItem } from "./dashboard-nav";

/** Business and admin workspaces: the site header, a quiet text sidebar, the page. */
export function DashboardShell({ label, nav, children }: { label: string; nav: NavItem[]; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="container-page grid flex-1 gap-8 pt-14 lg:grid-cols-[12rem_1fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</p>
          <DashboardNav items={nav} label={label} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex animate-rise flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title mt-3">{title}</h1>
        {description && <p className="mt-3 text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
