import { PageHero, ImageFeature, ImageCards, CTASection, SectionIntro, SpecStrip } from "@/components/site/SiteBlocks";
export const metadata = { title: "Capabilities", description: "Finocast investment casting, materials and CNC machining capabilities." };
const cards = [
 {title:"Ferrous alloys",body:"Carbon and low alloy steels, stainless steels, duplex grades and precipitation hardening stainless grades are listed in Finocast’s published material range.",image:"/images/02_cast_products/product_valve_body.jpg",alt:"Steel investment casting component"},
 {title:"Specialty materials",body:"Published material lists include nickel and cobalt alloys alongside aluminium, copper and bronze alloys. Confirm grade availability against your specification.",image:"/images/02_cast_products/product_manifold.jpg",alt:"Complex alloy casting"},
 {title:"Partner-supported machining",body:"CNC machining is coordinated through external manufacturing collaborations when the required operation is not performed in-house.",image:"/images/02_cast_products/product_misc_components.jpg",alt:"Investment cast components ready for agreed finishing operations"}
];
export default function CapabilitiesPage(){return <>
 <PageHero eyebrow="Capabilities" title="Investment castings shaped around the application." body="Lost-wax casting in ferrous and non-ferrous materials, with selected CNC machining coordinated through manufacturing collaborations." image="/images/01_hero/hero_precision_castings.jpg" alt="Precision investment cast metal components"/>
 <section className="section-block"><div className="wrap"><SectionIntro eyebrow="Manufacturing range" title="A versatile process for complex components." body="Finocast’s official brochure describes casting weights from 0.05 kg to 120 kg per piece. Final feasibility depends on geometry, material and specification."/><SpecStrip items={[{label:"Casting process",value:"Investment / lost wax"},{label:"Published weight range",value:"0.05–120 kg / piece"},{label:"Materials",value:"Ferrous & non-ferrous"}]}/></div></section>
 <section className="section-block section-muted"><div className="wrap"><ImageCards items={cards}/></div></section>
 <ImageFeature eyebrow="Design review" title="Bring the drawing into the conversation early." body="The company describes reviewing drawings, quality details and 3D models to consider standards, casting and mould scheme, tooling, machining flow, documentation, packing and project scheduling." image="/images/04_casting_process/process_wax_injection.jpg" alt="Wax pattern injection process" reverse link="/request-a-quote" linkLabel="Submit an enquiry"/>
 <CTASection title="Have a material or geometry question?" body="Share your component information and ask Finocast to review the manufacturing fit."/>
</>;}
