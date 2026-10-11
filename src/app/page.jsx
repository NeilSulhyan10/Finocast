import Image from "next/image";
import Link from "next/link";
import { CTASection, ImageCards, ImageFeature, SectionIntro, SpecStrip } from "@/components/site/SiteBlocks";
import { company } from "@/data/company";
import { versionedImagePath } from "@/lib/image-url";

const products = [
  { title: "Pump components", body: "Cast forms for fluid handling equipment.", image: "/images/02_cast_products/product_impeller.jpg", alt: "Investment cast impeller component" },
  { title: "Valve bodies", body: "Complex flow paths cast to drawing requirements.", image: "/images/02_cast_products/product_valve_body.jpg", alt: "Investment cast valve body" },
  { title: "Turbine profiles", body: "Detailed components for demanding applications.", image: "/images/02_cast_products/product_turbine_blade.jpg", alt: "Investment cast turbine blade" },
];

export const metadata = { title: "Precision Investment Casting", description: company.description };

export default function HomePage() {
  return <>
    <section className="home-hero">
      <Image src={versionedImagePath("/images/01_hero/hero_foundry_pouring.jpg")} alt="Molten metal being poured during a foundry operation" fill priority sizes="100vw" className="hero-photo" />
      <div className="hero-shade" />
      <div className="wrap home-hero-inner"><div className="home-copy"><p className="eyebrow">FINO CAST PRIVATE LIMITED <span>·</span> MIRAJ, INDIA</p><h1>Precision in every <em>pour.</em></h1><p className="hero-lede">Investment castings for components where material, geometry and finish matter, with selected machining coordinated through manufacturing partners.</p><div className="button-row"><Link className="button button-copper" href="/capabilities">Explore Our Capabilities <span aria-hidden="true">↗</span></Link><Link className="button button-outline-light" href="/request-a-quote">Request a Quote</Link></div></div>
        <div className="hero-caption"><span>01 / 04</span><span>Investment casting · Lost wax process</span></div>
      </div>
      <div className="hero-side-label">ENGINEERED IN METAL</div>
    </section>
    <div className="home-intro wrap"><p className="eyebrow">A PARTNER IN PRECISION</p><p>From the first drawing review to finished component, Finocast combines in-house investment casting with selected machining coordinated through external manufacturing collaborations.</p><Link className="text-link" href="/about">Discover Finocast <span aria-hidden="true">↗</span></Link></div>
    <section className="section-block"><div className="wrap"><SectionIntro eyebrow="What we make" title="Complex shapes. Considered from the start." body="Lost-wax investment casting gives design teams freedom to consolidate features and create intricate forms in a range of ferrous and non-ferrous alloys."/><ImageCards items={products}/><div className="section-end-link"><Link className="text-link" href="/capabilities">View casting capabilities <span aria-hidden="true">↗</span></Link></div></div></section>
    <section className="dark-section"><div className="wrap"><SectionIntro eyebrow="From pattern to part" title="One connected manufacturing process." body="Finocast’s foundry operations produce the casting. Selected finishing, machining and inspection requirements are planned with the route and supply scope agreed for each project." light/><div className="process-line">{[{n:"01",t:"Wax pattern"},{n:"02",t:"Ceramic shell"},{n:"03",t:"Melt & pour"},{n:"04",t:"Finish & inspect"}].map((x)=><Link href="/process" className="process-step" key={x.n}><span>{x.n}</span><strong>{x.t}</strong><i aria-hidden="true">↗</i></Link>)}</div><Link className="text-link light-link" href="/process">See the process <span aria-hidden="true">↗</span></Link></div></section>
    <ImageFeature eyebrow="Made for demanding service" title="Parts that carry responsibility." body="Finocast lists applications across pumps and valves, oil and gas, marine, power generation, automotive, defence and other engineering sectors. Each project starts with the component’s function and specification." image="/images/03_foundry_factory/factory_melting_pour.jpg" alt="Metal pouring at the foundry" link="/industries" linkLabel="Explore industries"/>
    <section className="quality-slice"><div className="wrap quality-layout"><div><p className="eyebrow">QUALITY AT EACH STAGE</p><h2>Inspection is part of the process.</h2><p>Material chemistry, dimensions and component condition are checked using the inspection methods and requirements agreed for each order.</p><Link className="text-link" href="/quality">Quality and inspection <span aria-hidden="true">↗</span></Link></div><div className="quality-image"><Image src={versionedImagePath("/images/06_quality_inspection/quality_cmm_inspection.jpg")} alt="Coordinate measuring machine inspecting a component" fill sizes="(max-width: 800px) 100vw, 50vw" className="cover-image"/></div></div></section>
    <section className="spec-section"><div className="wrap spec-layout"><div><p className="eyebrow">A CAPABILITY SNAPSHOT</p><h2>Built around the component.</h2><p className="muted-copy">Share a drawing, material requirement or target application to begin a technical review.</p><Link className="text-link" href="/request-a-quote">Send an enquiry <span aria-hidden="true">↗</span></Link></div><SpecStrip items={[{label:"Process",value:"Investment casting"},{label:"Casting weight",value:"0.05–120 kg"},{label:"Material range",value:"Ferrous & non-ferrous"},{label:"Location",value:"Miraj, Maharashtra"}]}/></div></section>
    <CTASection title="Let’s make the next part work harder." body="Talk with Finocast about your component, material and production requirements."/>
  </>;
}
