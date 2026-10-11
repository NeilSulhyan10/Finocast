import { PageHero, ImageCards, ImageFeature, CTASection, SectionIntro } from "@/components/site/SiteBlocks";
export const metadata = { title: "Industries", description: "Industries and applications listed by Finocast for investment cast components." };
const items = [
 {title:"Pumps & valves",body:"Flow control, pump and valve applications are among the company’s published product sectors.",image:"/images/07_industry_applications/industry_pumps_valves.jpg",alt:"Pumps and valves application"},
 {title:"Oil & gas",body:"Investment cast components for equipment used in demanding fluid and energy systems.",image:"/images/07_industry_applications/industry_oil_gas.jpg",alt:"Oil and gas industry application"},
 {title:"Marine",body:"Marine components are included in Finocast’s published application range.",image:"/images/07_industry_applications/industry_marine.jpg",alt:"Marine industry application"},
 {title:"Power generation",body:"Cast components for power generation and plant equipment applications.",image:"/images/07_industry_applications/industry_power_generation.jpg",alt:"Power generation equipment"},
 {title:"Automotive",body:"Automotive applications are listed among the sectors served by the foundry.",image:"/images/07_industry_applications/industry_automotive.jpg",alt:"Automotive component application"},
 {title:"Aerospace & defence",body:"Aerospace and defence are listed in company materials. Discuss applicable standards and qualification requirements for each enquiry.",image:"/images/07_industry_applications/industry_aerospace.jpg",alt:"Aerospace application"}
];
export default function IndustriesPage(){return <>
 <PageHero eyebrow="Industries" title="Cast components for demanding applications." body="Finocast lists applications across fluid handling, energy, transport and general engineering. Project fit begins with the part specification." image="/images/07_industry_applications/industry_oil_gas.jpg" alt="Industrial energy application"/>
 <section className="section-block"><div className="wrap"><SectionIntro eyebrow="Applications" title="Industry experience, part by part." body="These sectors reflect the applications published by Finocast. Specific material, performance and qualification requirements should be confirmed for each project."/><ImageCards items={items}/></div></section>
 <ImageFeature eyebrow="Start with the component" title="The right casting starts with its job." body="Share the operating environment, material needs and drawing details. The team can then assess whether investment casting and subsequent machining suit the part." image="/images/02_cast_products/product_pump_housing.jpg" alt="Cast pump housing component" reverse link="/request-a-quote" linkLabel="Discuss your component"/>
 <CTASection title="Tell us what your component needs to do."/>
</>;}
