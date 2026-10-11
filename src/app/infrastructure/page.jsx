import { PageHero, ImageCards, ImageFeature, CTASection, SectionIntro } from "@/components/site/SiteBlocks";

export const metadata = { title: "Infrastructure", description: "Finocast foundry operations and partner-supported machining capabilities in Miraj." };

const foundryAreas = [
  { title: "Metal melting & pouring", body: "Foundry operations for investment casting are based at Finocast’s Miraj facility.", image: "/images/03_foundry_factory/factory_melting_pour.jpg", alt: "Illustrative molten metal pour in an investment-casting foundry" },
  { title: "Ceramic shell preparation", body: "Shell building forms the mould used in the lost-wax casting process.", image: "/images/03_foundry_factory/factory_shell_making.jpg", alt: "Illustrative ceramic shell preparation for investment casting" },
  { title: "Casting production", body: "Investment cast components are produced through the foundry route at the Miraj facility.", image: "/images/02_cast_products/product_misc_components.jpg", alt: "Finished investment cast metal components" },
];

const partnerCapabilities = [
  { title: "CNC machining", text: "Precision machining is arranged through manufacturing collaborations when the operation is not performed in-house." },
  { title: "Turning", text: "Turning requirements can be fulfilled through external manufacturing partners as part of the agreed supply scope." },
  { title: "Vertical turning", text: "Vertical turning is partner-supported where this capability is not available at the Finocast facility." },
];

export default function InfrastructurePage() {
  return <>
    <PageHero eyebrow="Infrastructure" title="A foundry operation with a connected manufacturing network." body="Investment casting is based at Finocast’s Miraj facility. Selected machining operations are supported through external manufacturing collaborations when they are not performed in-house." image="/images/03_foundry_factory/factory_melting_pour.jpg" alt="Illustrative molten metal pour in an investment-casting foundry" />
    <section className="section-block">
      <div className="wrap">
      <SectionIntro eyebrow="In-house manufacturing" title="Investment casting at the Miraj foundry." body="The generated photographs are illustrative and do not depict Finocast’s actual facility. CNC machining, turning and vertical turning are presented separately where partner support is used." />
        <div className="capability-label"><span>IN-HOUSE MANUFACTURING</span><span>FINOCAST · MIRAJ</span></div>
        <ImageCards items={foundryAreas} />
      </div>
    </section>
    <section className="partner-section">
      <div className="wrap partner-layout">
        <div className="partner-intro"><p className="eyebrow">Partner-supported capabilities</p><h2>Extending the finished-part scope.</h2><p>Finocast coordinates with external manufacturing partners for selected machining operations that are not carried out at its own facility. The scope and route are confirmed for each project.</p><span className="capability-tag">PARTNER-SUPPORTED CAPABILITIES</span></div>
        <div className="partner-list">{partnerCapabilities.map((item, index) => <article className="partner-row" key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
      </div>
    </section>
    <ImageFeature eyebrow="Location" title="The casting operation is based in Miraj." body="Finocast’s factory address is Plot no. 14, Miraj MIDC, Miraj, Sangli district, Maharashtra 416410, India. Partner-supported work may take place outside this facility." image="/images/03_foundry_factory/factory_exterior.jpg" alt="Illustrative industrial foundry exterior; not a photograph of Finocast’s facility" reverse link="/contact" linkLabel="Get contact details" />
    <CTASection />
  </>;
}
