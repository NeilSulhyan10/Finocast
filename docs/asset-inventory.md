# Local image pack

Every image used by the site is stored locally under `public/images` and referenced by its real public URL. The directory contains 28 active assets: 27 newly generated standalone photographs and the Finocast logo. The new photographs are JPEGs at 1536×1152 pixels, except the three wide hero images at 1672×941 pixels. Generated facility, process, workforce, and industry scenes are illustrative stock-style imagery; they do not depict Finocast's actual facility or identify specific customer projects.

| Folder | Assets |
| --- | --- |
| `01_hero` | `hero_factory_interior.jpg`, `hero_foundry_pouring.jpg`, `hero_precision_castings.jpg` |
| `02_cast_products` | `product_impeller.jpg`, `product_manifold.jpg`, `product_misc_components.jpg`, `product_pump_housing.jpg`, `product_turbine_blade.jpg`, `product_valve_body.jpg` |
| `03_foundry_factory` | `factory_exterior.jpg`, `factory_melting_pour.jpg`, `factory_shell_making.jpg` |
| `04_casting_process` | `process_dewaxing.jpg`, `process_shell_coating.jpg`, `process_shell_ready.jpg`, `process_wax_injection.jpg` |
| `06_quality_inspection` | `quality_cmm_inspection.jpg`, `quality_hardness_test.jpg`, `quality_spectrometer.jpg`, `quality_visual_inspection.jpg` |
| `07_industry_applications` | `industry_aerospace.jpg`, `industry_automotive.jpg`, `industry_marine.jpg`, `industry_oil_gas.jpg`, `industry_power_generation.jpg`, `industry_pumps_valves.jpg` |
| `08_team_and_workplace` | `team_worker_inspection.jpg` |
| Root | `finocast-logo.png` |

Images render with Next.js `Image` at the local paths, descriptive alternative text, a sized/positioned container and cover cropping where appropriate. The 27 newly generated assets were created individually; none were extracted from the contact sheet. Existing images not among the requested replacements were preserved.
