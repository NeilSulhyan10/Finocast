"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navigation, company } from "@/data/company";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = navigation.filter((item) => !item.cta && item.href !== "/");
  return <header className="site-header"><div className="wrap nav-wrap">
    <Link href="/" className="brand" aria-label="Finocast home"><Image src="/images/finocast-logo.png" alt="Finocast" width={120} height={48} priority/><span>PRECISION CASTING</span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((item)=><Link href={item.href} key={item.href}>{item.label}</Link>)}<Link className="nav-quote" href="/request-a-quote">Request a Quote <span aria-hidden="true">↗</span></Link></nav>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={()=>setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div>
  <div id="mobile-navigation" className={`mobile-nav ${open ? "mobile-nav-open" : ""}`} aria-hidden={!open}>
    <nav aria-label="Mobile navigation">{links.map((item)=><Link href={item.href} key={item.href} onClick={()=>setOpen(false)} tabIndex={open ? 0 : -1}>{item.label}<span aria-hidden="true">↗</span></Link>)}<Link className="mobile-quote" href="/request-a-quote" onClick={()=>setOpen(false)} tabIndex={open ? 0 : -1}>Request a Quote <span aria-hidden="true">↗</span></Link></nav>
    <div className="mobile-contact"><span>ENQUIRIES</span><a href={`tel:${company.contact.phones[0].tel}`}>{company.contact.phones[0].number}</a>{company.contact.emails.map((email)=><a href={`mailto:${email.address}`} key={email.address}>{email.address}</a>)}</div>
  </div></header>;
}
