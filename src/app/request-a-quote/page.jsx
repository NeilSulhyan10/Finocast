import { PageHero } from "@/components/site/SiteBlocks";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Link from "next/link";
import { company } from "@/data/company";
export const metadata = { title: "Request a Quote", description: "Send Finocast your investment casting or machining requirements for review." };
export default function QuotePage(){return <>
 <PageHero compact eyebrow="Request a Quote" title="Start with the part." body="Tell us what you’re making, what it needs to do and any material or quantity requirements you already know." image="/images/02_cast_products/product_misc_components.jpg" alt="A selection of investment cast components"/>
 <section className="contact-section"><div className="wrap contact-layout"><aside className="contact-details quote-aside"><p className="eyebrow">For a useful review</p><h2>Include what you have.</h2><p>Complete the form with the information currently available. A drawing, 3D model, material specification, annual volume and required inspection documents can be shared by email after initial contact.</p><ul className="tick-list"><li>Component function and operating environment</li><li>Material or alloy grade</li><li>Approximate weight and order quantity</li><li>Machining and inspection requirements</li></ul><div className="quote-email-list"><span>Prefer email?</span>{company.contact.emails.map((email)=><a href={`mailto:${email.address}`} key={email.address}>{email.address}</a>)}</div><Link className="text-link" href="/capabilities">Review capabilities <span aria-hidden="true">↗</span></Link></aside><div className="contact-form-panel"><p className="eyebrow">Project details</p><h2>Request a quote.</h2><EnquiryForm type="rfq"/></div></div></section>
</>;}
