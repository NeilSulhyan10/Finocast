import { PageHero, ImageCards, CTASection, SectionIntro } from "@/components/site/SiteBlocks";
export const metadata = { title: "Investment Casting Process", description: "Understand the lost-wax investment casting process used by Finocast." };
const steps = [
 {title:"Wax pattern",body:"Wax is injected into a die to create the pattern that defines the final casting geometry.",image:"/images/04_casting_process/process_wax_injection.jpg",alt:"Wax pattern injection"},
 {title:"Ceramic shell",body:"Patterns are assembled and repeatedly coated to build a ceramic mould around the form.",image:"/images/04_casting_process/process_shell_coating.jpg",alt:"Ceramic shell coating"},
 {title:"Dewax & prepare",body:"The wax is removed from the shell, which is then prepared for molten metal.",image:"/images/04_casting_process/process_dewaxing.jpg",alt:"Dewaxing ceramic shell"},
 {title:"Melt & pour",body:"Metal is melted to the specified alloy and poured into the prepared shell.",image:"/images/03_foundry_factory/factory_melting_pour.jpg",alt:"Molten metal poured into a mould"},
 {title:"Finish & inspect",body:"After solidification, castings are separated, finished, inspected and prepared to the agreed supply scope.",image:"/images/06_quality_inspection/quality_visual_inspection.jpg",alt:"Visual inspection of a casting"}
];
export default function ProcessPage(){return <>
 <PageHero eyebrow="Process" title="From wax pattern to finished casting." body="The lost-wax process creates a ceramic shell around a disposable pattern, allowing intricate shapes to be cast in metal." image="/images/04_casting_process/process_shell_ready.jpg" alt="Prepared ceramic shell ready for casting"/>
 <section className="section-block"><div className="wrap"><SectionIntro eyebrow="The sequence" title="A series of deliberate transformations." body="Each operation contributes to the final geometry, surface and material integrity. Actual process controls are set to the agreed part and order requirements."/><ImageCards items={steps}/></div></section>
 <section className="process-note"><div className="wrap"><p className="eyebrow">PROJECT PLANNING</p><h2>Tooling, machining and delivery are part of the review.</h2><p>Finocast describes assessment of the mould scheme, pattern and die concept, machining flow, documentation, packing method and schedule before manufacture proceeds.</p><a className="text-link" href="/capabilities">Review capabilities <span aria-hidden="true">↗</span></a></div></section>
 <CTASection title="Have a casting ready for review?"/>
</>;}
