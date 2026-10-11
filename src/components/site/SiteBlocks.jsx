import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import { versionedImagePath } from "@/lib/image-url";

export function PageHero({ eyebrow, title, body, image, alt, compact = false }) {
  return <section className={`page-hero ${compact ? "page-hero-compact" : ""}`}>
    <Image src={versionedImagePath(image)} alt={alt} fill priority sizes="100vw" className="hero-photo" />
    <div className="hero-shade" />
    <div className="wrap hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="hero-lede">{body}</p></div>
    <span className="hero-index">FINOCAST / {eyebrow.toUpperCase()}</span>
  </section>;
}

export function SectionIntro({ eyebrow, title, body, light = false, number }) {
  return <div className={`section-intro ${light ? "section-intro-light" : ""}`}>
    <p className="eyebrow">{number && <span>{number} / </span>}{eyebrow}</p><h2>{title}</h2>{body && <p className="section-lede">{body}</p>}
  </div>;
}

export function ImageFeature({ eyebrow, title, body, image, alt, reverse = false, link, linkLabel, bullets = [] }) {
  return <section className={`feature-row ${reverse ? "feature-reverse" : ""}`}>
    <div className="feature-image"><Image src={versionedImagePath(image)} alt={alt} fill sizes="(max-width: 800px) 100vw, 50vw" className="cover-image" /></div>
    <div className="feature-copy"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{body}</p>{bullets.length > 0 && <ul className="tick-list">{bullets.map((item) => <li key={item}>{item}</li>)}</ul>}{link && <Link className="text-link" href={link}>{linkLabel || "Explore more"}<span aria-hidden="true">↗</span></Link>}</div>
  </section>;
}

export function ImageCards({ items, dark = false }) {
  return <div className={`image-cards ${dark ? "image-cards-dark" : ""}`}>{items.map((item, i) => <Reveal className="image-card-reveal" key={item.title}><article className="image-card">
    <div className="image-card-photo"><Image src={versionedImagePath(item.image)} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 33vw" className="cover-image" /></div>
    <div className="image-card-copy"><span className="card-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.body}</p>{item.href && <Link href={item.href} aria-label={`Explore ${item.title}`}>Explore <span aria-hidden="true">↗</span></Link>}</div>
  </article></Reveal>)}</div>;
}

export function CTASection({ eyebrow = "Start a conversation", title = "Have a component in mind?", body = "Share your drawing or requirements. Our team will review the application and respond with the next steps.", image = "/images/01_hero/hero_precision_castings.jpg" }) {
  return <section className="cta-band"><Image src={versionedImagePath(image)} alt="Precision investment cast components" fill sizes="100vw" className="cover-image" /><div className="cta-overlay" /><div className="wrap cta-content"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{body}</p><div className="button-row"><Link className="button button-copper" href="/request-a-quote">Request a Quote <span aria-hidden="true">↗</span></Link><Link className="button button-outline-light" href="/contact">Contact Finocast</Link></div></div></section>;
}

export function SpecStrip({ items }) {
  return <div className="spec-strip">{items.map((item) => <div className="spec-item" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>;
}
