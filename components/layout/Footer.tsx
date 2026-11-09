import Link from "next/link";
import { CookingPot, Mail, MessageCircle, Phone, Users } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { CurrentYear } from "./CurrentYear";

const { brand, explore, contact, information, bottom } = siteConfig.footer;

function FooterLinks({ links }: { links: readonly { label: string; href: string }[] }) {
  return <ul className="space-y-1">{links.filter(({ label, href }) => label.trim() && href.trim()).map(({ label, href }) =>
    <li key={href}><Link href={href} className="bep-link bep-footer-link flex min-h-11 items-center rounded-bep-sm px-2 text-sm">{label}</Link></li>,
  )}</ul>;
}

export function Footer() {
  const contacts = [
    { ...contact.hotline, icon: Phone, external: false },
    { ...contact.email, icon: Mail, external: false },
    { ...contact.zalo, icon: MessageCircle, external: true },
  ];
  return <footer className="bep-footer bg-bep-ink px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-11 text-bep-canvas sm:px-6 lg:pb-10 lg:pt-14">
    <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-[1.35fr_0.85fr_1.2fr_0.95fr] lg:gap-x-10">
      {(brand.name || brand.slogan || brand.description) && <div className="col-span-2 lg:col-span-1">
        {brand.name && <Link href="/" className="bep-link bep-footer-link inline-flex min-h-11 items-center gap-3 rounded-bep-sm px-1 text-lg font-bold"><span className="flex size-11 items-center justify-center rounded-bep-md bg-bep-primary-light text-bep-primary-dark"><CookingPot size={24} strokeWidth={2} aria-hidden="true" /></span>{brand.name}</Link>}
        {brand.slogan && <p className="mt-3 text-sm font-semibold text-bep-primary-light">{brand.slogan}</p>}
        {brand.description && <p className="mt-3 max-w-sm text-sm leading-7 text-bep-dim">{brand.description}</p>}
      </div>}
      {explore.heading && explore.links.some(({ label, href }) => label.trim() && href.trim()) && <nav aria-label={explore.heading}><h2 className="mb-3 text-sm font-bold text-bep-canvas">{explore.heading}</h2><FooterLinks links={explore.links} /></nav>}
      {contact.heading && (contacts.some(({ value, href }) => value.trim() && href.trim()) || contact.facebook.value.trim()) && <section aria-label={contact.heading}><h2 className="mb-3 text-sm font-bold text-bep-canvas">{contact.heading}</h2><ul className="space-y-1">
        {contacts.filter(({ value, href }) => value.trim() && href.trim()).map(({ label, value, href, icon: Icon, external }) => <li key={label}><a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="bep-link bep-footer-link flex min-h-11 items-center gap-2 rounded-bep-sm px-2 py-1 text-sm"><Icon size={17} className="shrink-0 text-bep-primary-light" aria-hidden="true" /><span className="min-w-0"><span className="block text-xs text-bep-primary-light">{label}</span><span className="block break-all">{value}</span></span></a></li>)}
        {contact.facebook.value.trim() && <li className="flex min-h-11 items-center gap-2 px-2 py-1 text-sm text-bep-dim"><Users size={17} className="shrink-0 text-bep-primary-light" aria-hidden="true" /><span><span className="block text-xs text-bep-primary-light">{contact.facebook.label}</span><span className="block break-words">{contact.facebook.value}</span></span></li>}
      </ul></section>}
      {information.heading && information.links.some(({ label, href }) => label.trim() && href.trim()) && <nav aria-label={information.heading}><h2 className="mb-3 text-sm font-bold text-bep-canvas">{information.heading}</h2><FooterLinks links={information.links} /></nav>}
    </div>
    <div className="mx-auto mt-10 flex max-w-[1200px] flex-col gap-2 border-t border-bep-canvas/20 pt-5 text-xs leading-6 text-bep-dim sm:flex-row sm:justify-between sm:gap-5">
      <p>© <CurrentYear /> {brand.name}{brand.name && bottom.nonCommercial ? " · " : ""}{bottom.nonCommercial}</p>
      {bottom.analytics && <p>{bottom.analytics}</p>}
    </div>
  </footer>;
}
