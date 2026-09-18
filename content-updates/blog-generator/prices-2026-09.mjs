// Prices, opening hours and three factual corrections, researched September 2026.
//
// Every pair is [what the article says now, what it should say]. The same pairs
// are applied twice: to the a*.mjs sources, so a regeneration keeps them, and as
// a surgical UPDATE ... replace() patch for the rows already in the database.
// The patch has to be surgical because blog-0*.sql re-inserts body_en on
// conflict, which would wipe the <figure> elements fill-post-images.ts has
// since written into those rows.
//
// Three corrections matter more than the prices:
//
//   1. Nefertari is not in the Valley of the Kings. QV66 is in the Valley of
//      the Queens, a separate site with its own entrance and its own ticket,
//      and the article had her listed among the Valley of the Kings add-ons.
//      The mix-up is common enough that the fix is now a section of its own.
//
//   2. KV9 is not on the general ticket. The article recommended Ramesses VI
//      as one of the three a visitor picks at the gate, which cannot be done:
//      it carries its own 220 EGP charge. Its slot goes to Thutmose III
//      (KV34), which is on the rotating list, and KV9 moves to the separate
//      tickets where it belongs.
//
//   3. a1 carried an unreplaced {{RELATED_POST_SLUG}} template token, which
//      would have rendered as a literal broken link at /blog/{{...}} on the
//      day it published. Abu Simbel is first in the schedule, so there is no
//      earlier sibling to link to; the clause is rewritten without one.

const NOTE = "All prices below were checked in September 2026 and change without much warning, so treat them as a guide rather than a quote.";

export default {
  "abu-simbel-tour-from-aswan": {
    body: [
      [`<tr><td>Cost</td><td><mark data-placeholder="abu-simbel-road-cost">FILL IN: typical road trip cost per person</mark></td><td><mark data-placeholder="abu-simbel-air-cost">FILL IN: typical flight package cost per person</mark></td></tr>`,
       `<tr><td>Typical shared trip cost</td><td>About 57 to 90 US dollars per person</td><td>Higher, and it moves with the airfare on the day</td></tr>`],

      [`<p>Tickets are bought at the site and prices change; check the current rate rather than trusting a figure in an article. Current entry cost is <mark data-placeholder="abu-simbel-ticket">FILL IN: current Abu Simbel entry ticket price</mark>, and the site opens at <mark data-placeholder="abu-simbel-hours">FILL IN: current opening hours</mark>.</p>`,
       `<p>${NOTE}</p>

<p>Entry is 822 Egyptian pounds for a foreign adult, roughly 17 US dollars, and 445.50 with a valid ISIC student card. One thing to know before you book: the ministry information page has been showing 750 pounds while the official booking portal charges 822. The figure at checkout is the one you pay.</p>

<p>The site opens at 6am with last entry at 4pm, every day of the year. During Ramadan that shifts to 7am with last entry at 3pm. On 22 February and 22 October, the two sun festival dates, there is an additional charge of around 1,200 pounds.</p>`],

      [`For the wider region, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor guide</a> is the natural next stop north, and <a href="/blog/{{RELATED_POST_SLUG}}">{{RELATED_POST_ANCHOR}}</a> covers the Nile stretch between them.`,
       `For the wider region, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor guide</a> is the natural next stop north, and the stretch of river between the two cities is easiest to see from the water rather than the road.`],
    ],
    faqs: [
      ["When is the Abu Simbel sun festival?",
       "On 22 February and 22 October each year, when sunrise runs straight down the temple axis and lights 3 of the 4 seated statues in the inner sanctuary. The alignment lasts about 20 minutes. Entry on those 2 days carries an extra charge of around 1,200 Egyptian pounds, and flights and rooms in the village sell out months ahead."],
    ],
  },

  "grand-egyptian-museum-tour": {
    body: [
      [`<p>Tickets are timed, which is unusual in Egypt and works in your favour: it keeps the entry crush down. Book ahead in high season rather than turning up.</p>

<p>Entry is <mark data-placeholder="gem-ticket">FILL IN: current general entry ticket price, and the separate Tutankhamun gallery supplement if one applies</mark>. Photography rules vary by gallery, and the ones that restrict it are signed.</p>

<p>The solar boat building is a separate structure and sometimes carries a separate charge. Check when you book rather than at the gate.</p>`,
       `<p>${NOTE}</p>

<p>Tickets are sold online only, at visit-gem.com, for a specific arrival slot. There is no ticket window at the building, so turning up without a booking does not work. Slots run at 9, 11, 1, 3, 5 and 7.</p>

<p>Entry is 1,450 Egyptian pounds for a foreign adult, roughly 30 US dollars, and 730 for a foreign student or a child aged 6 to 12. Under sixes go free. One ticket covers everything, including the Tutankhamun galleries: there is no supplement for them, whatever an older article may tell you.</p>

<p>If you are travelling from November onwards, budget more. An increase has been announced from 1 November 2026 that takes the foreign adult rate to about 35 US dollars.</p>

<p>One figure to ignore: 550 pounds circulates widely as the price of this museum. That is the Egyptian Museum in Tahrir, a different building with a different collection.</p>

<p>Photography rules vary by gallery, and the ones that restrict it are signed. The solar boat building is a separate structure and sometimes carries a separate charge, so check when you book rather than at the gate.</p>`],

      [`<tr><td>Time needed</td><td>Half a day minimum</td><td>2 to 3 hours</td></tr>`,
       `<tr><td>Time needed</td><td>Half a day minimum</td><td>2 to 3 hours</td></tr>
<tr><td>Foreign adult entry</td><td>1,450 EGP, about 30 USD</td><td>550 EGP</td></tr>`],

      [`<p>Current opening hours are <mark data-placeholder="gem-hours">FILL IN: current Grand Egyptian Museum opening hours, including any late evening</mark>.</p>`,
       `<p>The galleries are open 9am to 6pm daily, and until 9pm on Wednesdays and Saturdays. The wider complex, meaning the shops and the restaurants, runs 8:30am to 7pm. Those two late evenings are the quietest hours the building has and almost nobody uses them.</p>`],
    ],
    faqs: [
      ["Do you need to book Grand Egyptian Museum tickets in advance?",
       "Yes, always, because tickets are sold online only at visit-gem.com for a timed arrival slot. There is no ticket window at the building, so turning up without a booking does not work. Slots run at 9, 11, 1, 3, 5 and 7. Photography rules vary by gallery and the restricted ones are signed at the door."],
    ],
  },

  "tombs-in-the-valley-of-kings": {
    body: [
      // Correction 2: KV9 carries its own charge, so it cannot be one of the three.
      [`<p>If all three are open, take Ramesses VI, Ramesses III and Merenptah. Here is why.</p>`,
       `<p>If all three are open, take Thutmose III, Ramesses III and Merenptah. Here is why.</p>`],

      [`<p><strong>KV9, Ramesses VI.</strong> The best value on the general ticket by a wide margin. A long straight descent with the ceiling covered end to end in astronomical scenes, and colour that has survived unusually well. It is also large enough to absorb a crowd without feeling like a queue.</p>`,
       `<p><strong>KV34, Thutmose III.</strong> The strangest tomb open on the general ticket. You reach it by a steep staircase up a cleft in the cliff, the burial chamber is oval rather than rectangular, and the walls carry the Amduat drawn in a cursive, almost sketched hand that looks nothing like the formal painting everywhere else. The climb puts people off, which is part of the appeal.</p>`],

      [`<p>If one of those is shut, Ramesses IV (KV2) is the easiest substitute: short, bright, heavily decorated, and right near the entrance.</p>`,
       `<p>If one of those is shut, Ramesses IV (KV2) is the easiest substitute: short, bright, heavily decorated, and right near the entrance.</p>

<p>The rotating list your three are drawn from usually holds KV2 Ramesses IV, KV6 Ramesses IX, KV8 Merenptah, KV11 Ramesses III, KV14 Tausert and Setnakht, KV15 Seti II, KV34 Thutmose III, KV43 Thutmose IV and KV47 Siptah.</p>`],

      // Correction 1: Nefertari does not belong in this table.
      [`<p>Three tombs carry their own charge on top of the general ticket. They are not upsells in the usual sense; they are genuinely different propositions.</p>

<table>
<thead>
<tr><th>Tomb</th><th>What you get</th><th>Worth the extra?</th></tr>
</thead>
<tbody>
<tr><td>Tutankhamun (KV62)</td><td>A small, plain tomb with the mummy on display in situ</td><td>Only if the story matters more to you than the painting</td></tr>
<tr><td>Seti I (KV17)</td><td>The largest and finest tomb in the valley, recently reopened</td><td>Yes, if you can afford one splurge</td></tr>
<tr><td>Nefertari (QV66)</td><td>The best preserved painted tomb in Egypt, in the Valley of the Queens</td><td>Yes, and it is the one people regret skipping</td></tr>
</tbody>
</table>

<p>Current prices are <mark data-placeholder="vok-separate-tickets">FILL IN: current separate ticket prices for Tutankhamun, Seti I and Nefertari</mark>.</p>`,
       `<p>Four tombs inside the valley carry their own charge on top of the general ticket. They are not upsells in the usual sense; they are genuinely different propositions.</p>

<p>${NOTE}</p>

<table>
<thead>
<tr><th>Tomb</th><th class="price">Price</th><th>Worth the extra?</th></tr>
</thead>
<tbody>
<tr><td>Ramesses V and VI (KV9)</td><td class="price">220 EGP, about 4 USD</td><td>Yes. The best value on the west bank, for an astronomical ceiling that runs the full length of the tomb</td></tr>
<tr><td>Tutankhamun (KV62)</td><td class="price">700 EGP, about 13 USD</td><td>Only if the story matters more to you than the painting</td></tr>
<tr><td>Seti I (KV17)</td><td class="price">2,000 EGP, about 42 USD</td><td>For the art, and only if one splurge is in the budget</td></tr>
<tr><td>Ay (WV23)</td><td class="price">200 EGP</td><td>Rarely, and only if you are already deep in the subject</td></tr>
</tbody>
</table>

<p>If you buy one of these, make it KV9. Two hundred and twenty pounds is the smallest sum on the west bank that changes a day, and that ceiling is the best single thing most visitors will see here.</p>

<p>Nefertari is not on this list, and the reason surprises people.</p>`],

      [`<p>Whether that is worth a separate ticket depends entirely on what you want. If you have read about Carter and 1922 and want to stand where it happened, go. If you came for painted walls, spend the same money on Nefertari and you will be far happier.</p>`,
       `<p>Whether that is worth 700 pounds depends entirely on what you want. If you have read about Carter and 1922 and want to stand where it happened, go. If you came for painted walls, the 220 pounds for KV9 next door buys a great deal more of them.</p>`],

      // Correction 1, continued: the section that explains the mix-up.
      [`<h2>Nefertari and the Valley of the Queens</h2>

<p>Strictly this is not in the same valley, which is why people miss it. The Valley of the Queens is a short drive away and holds QV66, the tomb of Ramesses II's principal wife.</p>

<p>The painting is the finest surviving from the ancient world, and the reason is slightly grim: the tomb was closed to the public for most of the twentieth century, so it has not been breathed on. Visits are limited in number and duration to keep it that way.</p>

<p>Ten minutes inside is the allowance, and ten minutes is enough to understand why conservators fought so hard over it.</p>`,
       `<h2>Nefertari Is Not in the Valley of the Kings</h2>

<p>This one catches almost everybody, guidebooks included. Nefertari's tomb is QV66, and the QV stands for Queens. It sits in the Valley of the Queens, a separate site about two kilometres away with its own entrance, its own ticket office and its own opening hours.</p>

<p>So you cannot add her to a Valley of the Kings ticket, and asking at the Kings gate is how most people find that out, usually with half a morning left. If she is on your list, plan a second stop.</p>

<p>The Valley of the Queens general ticket is 220 pounds and covers four tombs. Nefertari is 1,700 pounds on top of that, about 36 US dollars, with entry capped at roughly ten minutes.</p>

<p>She is worth it. The painting is the finest surviving from the ancient world, for a slightly grim reason: the tomb was shut for most of the twentieth century, so it has not been breathed on. Ten minutes is enough to understand why conservators fought so hard over it.</p>`],

      [`<p>Everything is bought at the ticket office before the shuttle, not at the tomb entrances. Decide your three before you get to the window, because the queue behind you is not a good place to deliberate.</p>`,
       `<p>Everything is bought at the ticket office before the shuttle, not at the tomb entrances, and payment is by card only. There is no cash desk, which strands a surprising number of people every morning. The Seti I ticket is the exception: it is sold at the visitor centre before the electric train.</p>

<p>Decide your three before you get to the window, because the queue behind you is not a good place to deliberate.</p>`],

      [`<p>General entry is <mark data-placeholder="vok-general-ticket">FILL IN: current general Valley of the Kings ticket price, and whether it still covers three tombs</mark>. Photography inside carries a separate permit, and the rules change, so ask when you buy rather than assuming.</p>`,
       `<p>General entry is 750 Egyptian pounds, about 16 US dollars, and it still covers three tombs. A foreign student or a child aged 6 to 12 pays 380.</p>

<p>Photography has settled into something workable: a phone is free as long as the flash is off, a DSLR needs a 300 pound permit, and inside Tutankhamun's tomb no camera of any kind is allowed. That last one is enforced.</p>`],

      [`<p>The smaller Eighteenth Dynasty shafts, when they are open, are historically important and visually sparse. Thutmose III (KV34) is the exception and worth a slot if it is open, partly for the near vertical climb to reach it.</p>`,
       `<p>The smaller Eighteenth Dynasty shafts, when they are open, are historically important and visually sparse. Thutmose III (KV34) is the exception, which is why it is one of the three above rather than a fallback.</p>`],

      [`<p>The general rule with tombs in the valley of kings is that later usually means bigger and brighter. If you are choosing on looks alone, favour the Twentieth Dynasty.</p>`,
       `<p>The general rule with tombs in the valley of kings is that later usually means bigger and brighter. If you are choosing on looks alone, favour the Twentieth Dynasty, with KV34 as the one worth breaking the rule for.</p>`],
    ],
    faqs: [
      ["How many tombs does the general Valley of the Kings ticket cover?",
       "3 tombs, chosen by you at the gate from whatever is open that day, for 750 Egyptian pounds as of September 2026. The open list is usually between 8 and 12 and changes as conservation work moves around the valley, because visitor breath and sweat damage painted plaster. Payment at the office is by card only, with no cash desk."],
      ["Which 3 tombs should you choose in the Valley of the Kings?",
       "Thutmose III (KV34), Ramesses III (KV11) and Merenptah (KV8), if all 3 are open. KV34 has an oval burial chamber and a cursive Amduat, KV11 has side chambers of daily life scenes, and KV8 has the most dramatic descent. Ramesses VI (KV9) is often recommended but cannot be one of your three: it carries its own 220 pound ticket."],
      ["Is the Tutankhamun tomb worth the separate ticket?",
       "Only if the discovery story matters more to you than the painting. KV62 costs 700 Egyptian pounds on top of general entry, about 13 US dollars, and it is small: cut for someone else, adapted in a hurry, with decoration on 1 wall. Everything famous from it is in the Grand Egyptian Museum. Cameras of any kind are banned inside."],
      ["Is the Seti I tomb worth the extra cost?",
       "Yes, if you are making 1 splurge and you care about ancient art rather than ancient celebrity. KV17 costs 2,000 Egyptian pounds, about 42 US dollars, which is why most visitors walk past it. It is the deepest and most completely decorated tomb in the valley, and its relief carving beats anything else on the west bank. Buy that ticket at the visitor centre."],
      ["Which is better, Nefertari's tomb or Tutankhamun's?",
       "Nefertari (QV66) for almost everyone, but the 2 are not in the same place. QV66 is in the Valley of the Queens, a separate site about 2 km away, and costs 1,700 Egyptian pounds on top of that valley's own 220 pound ticket. Its painting is the best preserved to survive from the ancient world, and visits are capped at about 10 minutes."],
      ["Do you need a photography permit inside the tombs?",
       "Only for a proper camera. A phone is free as long as the flash is off, a DSLR needs a 300 pound permit bought at the ticket office, and inside Tutankhamun's tomb no camera of any kind is allowed. Carry small notes as well: the guardian at each of your 3 tombs will often light a ceiling detail you would otherwise miss."],
    ],
  },

  "what-to-see-in-luxor": {
    body: [
      [`<p>Tickets are bought per site, mostly at the entrance, and there is no single pass. Most west bank tickets are sold at a central office on the road in, not at the monuments, which catches people out. Current prices are <mark data-placeholder="luxor-tickets">FILL IN: current ticket prices for Valley of the Kings, Hatshepsut, Medinet Habu, Karnak and Luxor Temple</mark>.</p>`,
       `<p>Tickets are bought per site. Most west bank tickets are sold at a central office on the road in rather than at the monuments themselves, which catches people out, and payment across the west bank is by card only.</p>

<p>Prices move every year or two, so check the current rate before you go or ask your operator to confirm it alongside your itinerary. As a reference point checked in September 2026, the Valley of the Kings was 750 Egyptian pounds for three tombs, about 16 US dollars.</p>

<p>There is a pass, and whether it pays depends on your appetite. The standard Luxor Pass is about 130 US dollars and covers most sites on both banks, but not Seti I and not Nefertari. The premium version is around 250 and includes both. At four or five sites it is roughly a wash; if you intend to see everything including those two tombs, the premium pass wins comfortably.</p>`],
    ],
    faqs: [],
  },

  "dahshur-pyramids-egypt": {
    body: [
      [`<p>Tickets are per site and the pyramid interiors at Dahshur are normally included in site entry rather than charged separately, though this changes. Current prices are <mark data-placeholder="saqqara-dahshur-tickets">FILL IN: current Saqqara and Dahshur entry prices, plus any separate Serapeum or mastaba charges</mark>, and opening hours are <mark data-placeholder="saqqara-dahshur-hours">FILL IN: current opening hours for both sites</mark>.</p>`,
       `<p>Tickets are per site, and the pyramid interiors at Dahshur are normally included in site entry rather than charged separately, though the Serapeum and some of the Saqqara mastabas have carried their own charge at times.</p>

<p>Entry prices at Saqqara and Dahshur change most years and are card only, as they are across the Cairo sites. Check the current rate before you go, or ask your operator to confirm it alongside your itinerary. The same goes for opening hours, which shift with the season and again during Ramadan.</p>`],
    ],
    faqs: [],
  },
};
