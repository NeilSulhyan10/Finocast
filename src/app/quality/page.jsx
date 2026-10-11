import { PageHero, ImageCards, ImageFeature, CTASection, SectionIntro } from "@/components/site/SiteBlocks";
export const metadata = { title: "Quality & Inspection", description: "Finocast quality assurance and inspection methods for investment cast components." };
const checks = [
 {title:"Material chemistry",body:"Spectrometer analysis supports alloy identification and chemistry checks against the agreed specification.",image:"/images/06_quality_inspection/quality_spectrometer.jpg",alt:"Metal spectrometer used for material analysis"},
 {title:"Dimensional inspection",body:"Dimensional verification can be planned for cast or machined features against the agreed component drawing.",image:"/images/06_quality_inspection/quality_cmm_inspection.jpg",alt:"Dimensional inspection of a cast metal component"},
 {title:"Hardness testing",body:"Hardness testing can be applied when it forms part of the purchase specification.",image:"/images/06_quality_inspection/quality_hardness_test.jpg",alt:"Hardness testing of a metal component"},
 {title:"Visual inspection",body:"Components are reviewed for visible condition and finish as part of the agreed inspection plan.",image:"/images/06_quality_inspection/quality_visual_inspection.jpg",alt:"Visual inspection of metal casting"}
];
export default function QualityPage(){return <>
 <PageHero eyebrow="Quality" title="Confidence built into every stage." body="Inspection methods and acceptance criteria are aligned to the part drawing and customer requirements." image="/images/06_quality_inspection/quality_cmm_inspection.jpg" alt="Dimensional measurement of a cast component"/>
 <section className="section-block"><div className="wrap"><SectionIntro eyebrow="Inspection methods" title="Evidence matched to the requirement." body="Finocast publishes measuring, monitoring, controlling and testing facilities. The methods below are shown in its image and capability materials; confirm the inspection plan and reporting scope for your order."/><ImageCards items={checks}/></div></section>
 <ImageFeature eyebrow="Quality planning" title="Agree the checks before production." body="Share the applicable drawing, material specification, acceptance criteria and any required inspection documentation when requesting a quote. Certification status is not displayed here because current validity could not be independently confirmed." image="/images/08_team_and_workplace/team_worker_inspection.jpg" alt="Worker inspecting a component" reverse link="/request-a-quote" linkLabel="Discuss quality requirements"/>
 <CTASection title="Need a particular inspection report?" body="Include your quality and documentation requirements with the enquiry so they can be reviewed alongside the component."/>
</>;}
