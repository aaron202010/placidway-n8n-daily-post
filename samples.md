# Sample posts from real PlacidWay pages

The workflow generated these on 2026-11-10 (n8n execution ids shown). Every post below passed both guardrails (rule check and LLM check). Samples 1 to 8 ran in **simulation mode**: the workflow built and logged the exact Facebook Graph API request and posted nothing. Sample 9 ran in **live mode** and published to a Facebook TEST Page ("Aaron Automation Test"). Simulation stays available through the `publish_mode` config flag.

Source note: PlacidWay's Cloudflare returns HTTP 403 to the server this n8n runs on (a datacenter IP), even though robots.txt allows all agents. So the workflow read these pages from their Internet Archive copies (snapshot dates shown). The post always links to the live PlacidWay URL. From a normal network the same workflow reads PlacidWay directly.

Character counts are for the text before the link (brief: under 500).

## 1. Article (Monday/Thursday slot)

- Source: https://www.placidway.com/article/9143/7-Orthopedic-Conditions-That-Stem-Cell-Joint-Therapy-in-Malaysia-Can-Help-Treat-Without-Surgery-in-2026
- Page title: 7 Orthopedic Conditions That Stem Cell Joint Therapy in Malaysia Can Help Treat Without Surgery in 2026
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/article_thumb/17787487367-Orthopedic-Conditions-That-Stem-Cell-Joint-Therapy-in-Malaysia-Can-Help-Treat-Without-Surgery-in-2026.png
- Read from: Internet Archive snapshot 20260616160648
- Run: execution 102777, auto mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102777
- Characters before link: 495
- Rule check: pass. LLM check: pass ("The draft only describes what the guide covers (seven conditions, osteoarthritis, rheumatoid arthritis, rotator cuff, meniscus), and it makes no medical claims, outcome promises, prices or unsupported facts.")

```text
Thinking about joint treatment without surgery? Here's what a PlacidWay guide covers.

The guide reviews seven orthopedic conditions discussed in stem cell joint therapy in Malaysia.
It covers knee, hip and shoulder osteoarthritis, rheumatoid arthritis and rotator cuff tears.
It also looks at meniscus tears and cartilage damage, the approaches involved, and why preserving the meniscus matters.

Read the full guide on PlacidWay to see which conditions it covers and ask us about your options.

https://www.placidway.com/article/9143/7-Orthopedic-Conditions-That-Stem-Cell-Joint-Therapy-in-Malaysia-Can-Help-Treat-Without-Surgery-in-2026

#StemCellTherapy #MedicalTourism #MalaysiaHealthcare #OrthopedicCare #JointHealth
```

## 2. Package (Tuesday/Saturday slot)

- Source: https://www.placidway.com/package/8072/Stem-Cell-Therapy-for-Neurological-Disease-Packages-in-Tijuana-Mexico-by-CellsTime-Clinique
- Page title: Stem Cell Therapy for Neurological Disease Packages in Tijuana, Mexico by CellsTime Clinique
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/package/177904341314-Stem-Cell-Therapy-for-Neurological-Disease-Packages-in-Tijuana,-Mexico-by-CellsTime-Clinique.jpg
- Read from: Internet Archive snapshot 20260615202557
- Run: execution 102776, auto mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102776
- Characters before link: 437
- Rule check: pass. LLM check: pass ("The draft sticks to what the page lists: the 'starting from $9,099' price, the conditions named, and the exclusions. It makes no efficacy claims, outcome promises, or invented facts.")

```text
Considering stem cell therapy for a neurological condition? Here is what the CellsTime Clinique package covers.

The package is offered at CellsTime Clinique in Tijuana, Mexico, starting from $9,099.
The page lists conditions it covers, including MS, ALS, Parkinson's and spinal cord injury.
Airfare, extra hotel nights and pre-arrival neuroimaging are listed as excluded.

Read the full package guide or ask PlacidWay about the details.

https://www.placidway.com/package/8072/Stem-Cell-Therapy-for-Neurological-Disease-Packages-in-Tijuana-Mexico-by-CellsTime-Clinique

#StemCellTherapy #NeurologicalCare #MedicalTravel #TijuanaMexico #PlacidWay
```

## 3. Patient Q&A (Wednesday/Sunday slot)

- Source: https://www.placidway.com/answer-detail/572434/Can-Revision-Surgery-in-Mexico-Help-After-a-Failed-Spinal-Fusion-A-Guide-for-US-Patients
- Page title: Can Revision Surgery in Mexico Help After a Failed Spinal Fusion? A Guide for U.S. Patients
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/questions/1782733834GEO-Thumb-(1).png
- Read from: Internet Archive snapshot 20260704031335
- Run: execution 102782, auto mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102782
- Characters before link: 406
- Rule check: pass. LLM check: pass ("Every cause named in the draft (nonunion, hardware loosening, adjacent segment disease, smoking and nicotine) is supported by the source, and the draft makes no cure claims, outcome promises or prices.")

```text
Has a spinal fusion failed? Here is what can cause it.

A failed fusion often comes from nonunion, where the bone graft does not fuse the vertebrae.
Hardware loosening or adjacent segment disease can also require a second operation.
Smoking is a leading preventable cause, since nicotine restricts the bone healing that fusion needs.

Read our full guide to see how revision surgery in Mexico is evaluated.

https://www.placidway.com/answer-detail/572434/Can-Revision-Surgery-in-Mexico-Help-After-a-Failed-Spinal-Fusion-A-Guide-for-US-Patients

#SpineSurgery #SpinalFusion #MedicalTourism #MexicoHealthcare
```

## 4. News (Friday slot)

- Source: https://www.placidway.com/news-detail/4580/Tapping-into-Wellness-How-Thailands-118-Hot-Springs-Are-Attracting-European-and-Japanese-Tourists-for-Holistic-Joint-Therapy
- Page title: Tapping into Wellness: How Thailand’s 118 Hot Springs Are Attracting European and Japanese Tourists for Holistic Joint Therapy
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/news/1777969611Tapping-into-Wellness-How-Thailand’s-118-Hot-Springs-Are-Attracting-European-and-Japanese-Tourists-for-Holistic-Joint-Therapy.png
- Read from: Internet Archive snapshot 20260612200834
- Run: execution 102783, auto mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102783
- Characters before link: 388
- Rule check: pass. LLM check: pass ("The draft only describes what the article covers (118 springs, European and Japanese visitors, Chiang Mai, Krabi and Ranong) and invites readers to read more, with no medical claims, outcome promises, prices or unsupported facts.")

```text
Thailand's 118 hot springs are drawing European and Japanese visitors.

This guide explains how mineral-rich springs are paired with holistic joint therapy programs.
Travelers from Europe and Japan are among those booking these wellness stays.
The article covers top destinations including Chiang Mai, Krabi and Ranong.

Read the full guide or ask PlacidWay about wellness packages today.

https://www.placidway.com/news-detail/4580/Tapping-into-Wellness-How-Thailands-118-Hot-Springs-Are-Attracting-European-and-Japanese-Tourists-for-Holistic-Joint-Therapy

#ThailandWellness #HotSpringTherapy #MedicalTourism #JointHealth
```

## 5. Package, next run (dedupe moved on to the next URL)

- Source: https://www.placidway.com/package/8073/Stem-Cell-Therapy-for-Multiple-Sclerosis-Package-in-Tijuana-Mexico-by-CellsTime-Clinique
- Page title: Stem Cell Therapy for Multiple Sclerosis Package in Tijuana, Mexico by CellsTime Clinique
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/package/177904391615-Stem-Cell-Therapy-for-Multiple-Sclerosis-Package-in-Tijuana,-Mexico-by-CellsTime-Clinique.jpg
- Read from: Internet Archive snapshot 20260615200453
- Run: execution 102784, auto mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102784
- Characters before link: 427
- Rule check: pass. LLM check: pass ("The draft sticks to what the source lists (the $9,099 starting price, the all-inclusive package and its inclusions), makes no medical or outcome claims, and ends with an invitation to read more.")

```text
Considering stem cell therapy for MS? Here is what this package covers.

CellsTime Clinique in Tijuana offers an all-inclusive stem cell therapy package for MS.
The fixed package price listed is $9,099 USD, starting from that figure.
It includes initial neurological assessment, cell processing checks, IV and localized application, and post-treatment monitoring.

Read the full guide or ask PlacidWay about this package today.

https://www.placidway.com/package/8073/Stem-Cell-Therapy-for-Multiple-Sclerosis-Package-in-Tijuana-Mexico-by-CellsTime-Clinique

#MultipleSclerosis #StemCellTherapy #TijuanaMexico #MedicalTourism
```

## 6. Patient Q&A, written after the guardrails blocked a bad first draft

- Source: https://www.placidway.com/answer-detail/572433/How-much-does-IVF-with-donor-eggs-in-Cyprus-cost-for-Indian-patients-and-is-it-cheaper-than-IVF-in-India
- Page title: How Much Does IVF With Donor Eggs in Cyprus Cost for Indian Patients and Is It Cheaper Than IVF in India?
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/questions/1782143459How-much-does-IVF-with-donor-eggs-in-Cyprus-cost-for-Indian-patients-and-is-it-cheaper-than-IVF-in-India-(1).png
- Read from: Internet Archive snapshot 20260704031341
- Run: execution 102791, auto mode, simulation, attempts: 2, status: simulated, FB post id: SIMULATED-102791
- Characters before link: 323
- Rule check: pass. LLM check: pass ("The draft uses a question hook, quotes the source's prices exactly ($5,500 to $7,500 for Cyprus, $3,000 to $4,500 for India), describes what the guide covers (costs, waitlists, travel), and makes no medical claim or outcome promise.")

```text
Is IVF with donor eggs in Cyprus cheaper than in India?

Cyprus donor egg IVF costs $5,500 to $7,500 for a complete cycle.
IVF in India has a lower sticker price, at $3,000 to $4,500.
This guide compares the costs, donor waitlists and travel expenses.

Read the full price comparison guide on PlacidWay and ask us anything.

https://www.placidway.com/answer-detail/572433/How-much-does-IVF-with-donor-eggs-in-Cyprus-cost-for-Indian-patients-and-is-it-cheaper-than-IVF-in-India

#IVFDonorEggs #CyprusIVF #FertilityTreatment #MedicalTravel
```

**What happened first on this run (guardrail demo).** For this test, the webhook field `test_draft` replaced the first draft with a deliberately bad one. Both checks blocked it. The model then wrote the post above from the source, with the issues as feedback. The blocked draft:

```text
Finally, a cure for failed back surgery!

Revision surgery in Mexico is guaranteed to fix a failed spinal fusion.
Packages start at just $4,999 with a 98% success rate.
Mexico has the best spine surgeons in the world.

Book today and walk pain-free next month.

https://www.placidway.com/answer-detail/572433/How-much-does-IVF-with-donor-eggs-in-Cyprus-cost-for-Indian-patients-and-is-it-cheaper-than-IVF-in-India

#BackPain #MiracleCure #Mexico
```

The rule check found: outcome_promise "guaranteed"; outcome_promise "pain-free"; medical_claim "cure"; medical_claim "to fix"; medical_claim "success rate"; invented_price "$4,999"; unsupported_fact "98%".

The LLM check found: medical_claim "Finally, a cure for failed back surgery!" (States that a treatment cures a condition. The source covers donor egg IVF in Cyprus, not back surgery.); medical_claim "Revision surgery in Mexico is guaranteed to fix a failed spinal fusion." (Says a treatment is guaranteed to fix a condition. The source says nothing about this.); invented_price "Packages start at just $4,999" (This price does not appear in the source. The source gives $5,500-$7,500 for donor egg IVF in Cyprus.); unsupported_fact "with a 98% success rate" (Not in the source. The source cites 65-75% for Cyprus donor egg IVF.); unsupported_fact "Mexico has the best spine surgeons in the world." (Unsupported ranking claim. The source does not mention Mexico or spine surgery.); outcome_promise "Book today and walk pain-free next month." (Promises a pain-free result to the reader and carries a call to action tied to an unsupported claim.); medical_claim "#MiracleCure" (The hashtag implies a treatment cures.).

## 7. Package, approval mode (reviewer clicked Approve)

- Source: https://www.placidway.com/package/8071/Stem-Cell-Therapy-for-Bulging-and-Herniated-Discs-in-Tijuana-Mexico-by-CellsTime-Clinique
- Page title: Stem Cell Therapy for Bulging and Herniated Discs in Tijuana, Mexico by CellsTime Clinique
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/package/177904263612-Stem-Cell-Therapy-for-Bulging-and-Herniated-Discs-in-Tijuana,-Mexico-by-CellsTime-Clinique.jpg
- Read from: Internet Archive snapshot 20260611230139
- Run: execution 102792, approval mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102792
- Characters before link: 366
- Rule check: pass. LLM check: pass ("The draft sticks to what the package includes and excludes as stated on the source page, with a question hook and an invitation to read more, and it makes no medical claims, outcome promises, or price claims.")

```text
Considering stem cell therapy for bulging or herniated discs?

CellsTime Clinique in Tijuana lists an all-inclusive package for disc problems.
The package covers stem cell application, initial evaluations, lab work and physician fees.
Airfare, hotels, excluded imaging and personal expenses are not included.

Read the full guide or ask PlacidWay about this package.

https://www.placidway.com/package/8071/Stem-Cell-Therapy-for-Bulging-and-Herniated-Discs-in-Tijuana-Mexico-by-CellsTime-Clinique

#StemCellTherapy #DiscHerniation #SpineCare #MedicalTourism #TijuanaMexico
```

## 8. News, check run after the final deploy

- Source: https://www.placidway.com/news-detail/4618/PlacidWay-and-Hospital-Cyntar-Announce-Partnership-to-Expand-Access-to-World-Class-Multi-Specialty-Healthcare-in-Tijuana
- Page title: PlacidWay and Hospital Cyntar Announce Partnership to Expand Access to World-Class Multi-Specialty Healthcare in Tijuana
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/news/1787147702Cyntar-Hospital-in-Tijuana-x-PlacidWay-Medical-Tourism.jpg
- Read from: Internet Archive snapshot 20260823113124
- Run: execution 102801, auto mode, simulation, attempts: 1, status: simulated, FB post id: SIMULATED-102801
- Characters before link: 404
- Rule check: pass. LLM check: pass ("Every statement in the draft is supported by the source (partnership, JCI/GHA accreditation, robotic and minimally invasive platforms, Tijuana medical district, proximity to the border). It makes no medical claims, outcome promises, or prices, and the call to action is only an invitation to read more and ask.")

```text
PlacidWay now partners with Hospital Cyntar in Tijuana, Mexico.

The partnership connects international patients with Hospital Cyntar's multi-specialty programs.
Hospital Cyntar is JCI and GHA accredited, with robotic and minimally invasive surgical platforms.
The hospital sits in Tijuana's medical district, near the U.S.-Mexico border.

Read the full announcement and ask PlacidWay about your options.

https://www.placidway.com/news-detail/4618/PlacidWay-and-Hospital-Cyntar-Announce-Partnership-to-Expand-Access-to-World-Class-Multi-Specialty-Healthcare-in-Tijuana

#MedicalTourism #Tijuana #HospitalCyntar #CrossBorderHealthcare #PlacidWay
```

## 9. Package, live publish to the test Page

- Source: https://www.placidway.com/package/8069/ENDO-in-a-day-Total-Hip-Replacement-as-an-outpatient-in-Mainz-Germany
- Page title: ENDO-in-a-Day: Total Hip Replacement as an Outpatient in Mainz, Germany (20 Minutes from Frankfurt Airport)
- Featured image: https://placidwaycdn.s3.amazonaws.com/images/package/1779846530ENDO-in-a-Day-Total-Hip-Replacement-as-an-Outpatient-in-Mainz,-Germany-by-Rhein-Main.jpg
- Read from: Internet Archive snapshot 20260613213106 (archive copy, because PlacidWay's Cloudflare returns 403 to this server; the post links to the live PlacidWay URL)
- Run: execution 102818, auto mode, **live**, attempts: 1, status: published, FB post id: 1464168450123200_122098890435545923
- Facebook post (test Page "Aaron Automation Test"): https://www.facebook.com/1464168450123200_122098890435545923
- Characters before link: 455
- Rule check: pass. LLM check: pass ("Every statement matches the source: the package inclusions, the exclusions (airfare, transfers, accommodation), and the day-by-day guide. The draft makes no medical claims, outcome promises or price mentions, and the hashtags carry no claims.")

```text
Considering same-day hip surgery in Mainz, Germany? Here is what the package covers.

ENDO-in-a-day is an outpatient total hip replacement at ENDOPROTHETICUM Rhein-Main in Mainz.
The package lists consultation, surgery, implant, anesthesia, same-day care and a physical therapy session.
Travel costs such as airfare, transfers and accommodation outside the clinic stay are not included.

Read the full guide to see the day-by-day plan and package details.

https://www.placidway.com/package/8069/ENDO-in-a-day-Total-Hip-Replacement-as-an-outpatient-in-Mainz-Germany

#HipReplacement #MedicalTourism #MainzGermany #OutpatientSurgery #OrthopedicCare
```

## The Graph API request logged for sample 1 (simulation)

```json
{
  "method": "POST",
  "endpoint": "https://graph.facebook.com/v24.0/REPLACE_WITH_TEST_PAGE_ID/photos",
  "params": {
    "url": "https://placidwaycdn.s3.amazonaws.com/images/article_thumb/17787487367-Orthopedic-Conditions-That-Stem-Cell-Joint-Therapy-in-Malaysia-Can-Help-Treat-Without-Surgery-in-2026.png",
    "caption": "Thinking about joint treatment without surgery? Here's what a PlacidWay guide covers.\n\nThe guide reviews seven orthopedic conditions discussed in stem cell joint therapy in Malaysia.\nIt covers knee, hip and shoulder osteoarthritis, rheumatoid arthritis and rotator cuff tears.\nIt also looks at meniscus tears and cartilage damage, the approaches involved, and why preserving the meniscus matters.\n\nRead the full guide on PlacidWay to see which conditions it covers and ask us about your options.\n\nhttps://www.placidway.com/article/9143/7-Orthopedic-Conditions-That-Stem-Cell-Joint-Therapy-in-Malaysia-Can-Help-Treat-Without-Surgery-in-2026\n\n#StemCellTherapy #MedicalTourism #MalaysiaHealthcare #OrthopedicCare #JointHealth"
  },
  "auth": "access_token=<TEST page token from the n8n credential, never logged>"
}
```

Sample 1 ran before the API version setting moved from v24.0 to v27.0, the version in Meta's current Pages API docs. Later runs (sample 8) log v27.0.
