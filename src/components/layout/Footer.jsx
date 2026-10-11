import Link from "next/link";
import { company } from "@/data/company";
import { YearDisplay } from "@/components/ui/YearDisplay";

export function Footer() {
  return <footer className="site-footer"><div className="wrap footer-main">
    <div className="footer-brand"><Link href="/" className="footer-wordmark">FINOCAST<span>®</span></Link><p>Precision investment castings and machining for industrial applications.</p><Link className="footer-cta" href="/request-a-quote">Start a project <span aria-hidden="true">↗</span></Link></div>
    <div className="footer-column"><h2>Explore</h2><Link href="/about">About</Link><Link href="/capabilities">Capabilities</Link><Link href="/process">Process</Link><Link href="/infrastructure">Infrastructure</Link></div>
    <div className="footer-column"><h2>Company</h2><Link href="/industries">Industries</Link><Link href="/quality">Quality</Link><Link href="/contact">Contact</Link><Link href="/request-a-quote">Request a Quote</Link></div>
    <div className="footer-column footer-contact"><h2>Find us</h2><address>{company.addresses.factory.street}, {company.addresses.factory.area}<br/>{company.addresses.factory.city}, {company.addresses.factory.state} {company.addresses.factory.postalCode}, India</address>{company.contact.phones.map((p)=><a href={`tel:${p.tel}`} key={p.tel}>{p.number}</a>)}{company.contact.emails.map((email)=><a href={`mailto:${email.address}`} key={email.address}>{email.address}</a>)}</div>
  </div><div className="wrap footer-bottom"><span>© <YearDisplay/> Fino Cast Private Limited</span><span>Miraj · Maharashtra · India</span><Link href="/contact">Contact details</Link></div></footer>;
}
