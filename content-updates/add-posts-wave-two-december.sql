-- Wave "two-december": 4 articles, loaded in one file.
--
--   2026-12-01T09:00:00+02:00  hatshepsut-temple  (hatshepsut temple)
--   2026-12-05T09:00:00+02:00  memphis-egypt  (memphis egypt)
--   2026-12-10T09:00:00+02:00  deir-el-medina  (deir el medina)
--   2026-12-15T09:00:00+02:00  bahariya-oasis-egypt  (bahariya oasis egypt)
--
-- Scheduled via posts.scheduled_at, so every row stays out of the blog list,
-- the sitemap and the server rendered meta until its moment. published_at
-- carries the same instant as the article's own date. See
-- shared/post-visibility.ts for the visibility rule.
--
-- RUN THE MIGRATION FIRST (Admin > Settings > Run Migrations). This needs
-- posts.scheduled_at, posts.faqs and posts.schema_markup.
--
-- Only the English columns are filled. title_es/fr/jp and body_es/fr/jp are
-- deliberately left NULL rather than machine translated.
--
-- Images are NOT set here. scripts/fill-post-images.ts fetches them, checks
-- each candidate against the provider's own description, and writes
-- featured_image plus the in-body figures. Run it after this file.
--
-- The hero alt text each article wants, carrying its focus keyword, which is
-- one of the required keyword placements. featured_image_alt stays NULL until
-- there is an image to describe; these are the strings to use when there is:
--
--   hatshepsut-temple
--     The terraces and colonnades of the hatshepsut temple below the cliff at Deir el Bahari
--   memphis-egypt
--     Palm groves and excavated stone at the site of memphis egypt near Mit Rahina
--   deir-el-medina
--     Stone foundations of the workers houses at deir el medina on the Luxor west bank
--   bahariya-oasis-egypt
--     Date palms and a spring fed pool in bahariya oasis egypt near the town of Bawiti
--
-- Safe to run twice. See the ON CONFLICT block: a row whose body already has
-- figures in it keeps that body rather than losing the images.

-- ---------------------------------------------------------------------------
-- Before: what is already in the database for these slugs.
-- On a first run this returns no rows, which is the expected result.
-- ---------------------------------------------------------------------------
SELECT slug,
       status,
       scheduled_at,
       published_at,
       length(body_en) AS body_chars,
       (body_en LIKE '%<figure%') AS has_images,
       updated_at
FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt')
ORDER BY scheduled_at;

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, published_at, faqs, schema_type
) VALUES
(
  'hatshepsut-temple',
  'Hatshepsut Temple at Deir el Bahari: One Monument, Two Names',
  '<p>Start with the thing that confuses everyone. The hatshepsut temple and the monument sold on itineraries as Deir el Bahari are not two places. They are one building with two names: an Arabic name taken from a Coptic monastery that later stood on the site, and an Egyptological one taken from the queen who built it.</p>

<p>If a schedule lists both, it has double counted a single morning.</p>

<p>The ancient name was Djeser Djeseru, the holy of holies. It stands in a natural bay in the cliffs on the Theban west bank, three terraces rising on ramps against three hundred metres of rock, and it is the most immediately photogenic building in Egypt. It is also, on a summer morning, one of the hottest places you will ever stand.</p>

<h2>Who Hatshepsut Was and Why the Building Exists</h2>

<p>She was the daughter of Thutmose I and the wife of her half brother Thutmose II. When he died she became regent for his young son. Within a few years she had stopped being a regent and was ruling as king, with the full titulary, the crowns and, in most of her statuary, the false beard.</p>

<p>She held that position for around twenty two years. The reign was prosperous and almost entirely peaceful, which in the Eighteenth Dynasty made it unusual.</p>

<p>The building is a mortuary temple, meaning a place where her cult was maintained after death, not the place she was buried. Her tomb is in the royal valley on the other side of the same hill, roughly a kilometre away through the rock.</p>

<p>Her architect was Senenmut, a commoner who rose extraordinarily high, held around eighty titles and was tutor to her daughter. He built himself a tomb underneath the temple forecourt, which is not the act of a man worried about his position.</p>

<!-- OWNER: first-hand paragraph fits well here, on the first sight of the terraces from the approach road -->

<h2>The Architecture, and Why It Looks Modern</h2>

<p>Because it is doing something almost no other Egyptian temple does: answering the landscape rather than ignoring it.</p>

<p>Most temples are enclosed boxes, dark at the far end, with pylons announcing them from the front. This one is open, terraced and horizontal, with long colonnades of square piers that repeat the vertical fissures in the cliff behind. From a distance the building and the rock read as one shape.</p>

<p>There was a model. Five hundred years earlier Mentuhotep II built a terraced temple immediately to the south, and its ruins are still there beside the newer building, largely ignored by everyone walking past. Hatshepsut''s architect took that idea and stretched it.</p>

<p>Three levels, two ramps on a single axis, colonnades to either side of each ramp. A causeway once ran from the edge of the cultivation to the lower court, lined with sphinxes.</p>

<p>The proportions are the reason it survives so well in photographs. Nothing on the facade is ornate and nothing is trying to overwhelm you.</p>

<p>That restraint was a choice, and it was not the fashion. Her father and her stepson both built in the enclosed, pylon fronted style, piling courts in front of courts. This building goes the other way and lets the cliff do the work of a pylon.</p>

<p>It has been called modernist more than once, usually by people who have just come from somewhere heavier. The comparison does not really hold, because every line here is doing religious work rather than aesthetic work, but it explains why the building photographs the way it does on a phone in 2026.</p>

<h2>The Punt Reliefs on the Middle Terrace</h2>

<p>South colonnade, middle level. This is the single best reason to come.</p>

<p>Around the fifteenth century BC Hatshepsut sent a trading expedition to the land of Punt, most likely somewhere on the coast of the Horn of Africa or southern Red Sea, and then had the whole voyage carved on a wall in sequence like a documentary.</p>

<p>The ships are shown being loaded. The houses of Punt are on stilts, reached by ladders, with palms around them. The ruler of Punt appears with his wife, Queen Ati, whose body is rendered with a frankness that has caused a century and a half of argument among people who would rather Egyptian art idealised everyone.</p>

<p>The cargo is itemised: incense, ebony, ivory, gold, apes, and thirty one living myrrh trees with their root balls wrapped, carried aboard on poles. Those trees were planted in the terrace gardens here, and the pits that held them have been found in front of the lower colonnade.</p>

<p>Very little else in Egyptian art records an actual journey this carefully. Most royal walls record battles that may or may not have happened.</p>

<h2>The Divine Birth Colonnade</h2>

<p>North side of the same terrace, and a colder kind of interesting.</p>

<p>The reliefs show the god Amun visiting Hatshepsut''s mother Ahmose in the form of her husband, and the conception, birth and divine acknowledgement of Hatshepsut herself. The child is presented to the gods and confirmed as the rightful ruler.</p>

<p>This is propaganda in the strict sense, carved in stone at public scale, arguing a case. A woman ruling as king had no precedent worth relying on, so the case had to be made theologically: not merely the daughter of a king, but the daughter of a god.</p>

<p>The panels are shallow and the light is poor for much of the day. Go in the first hour, when the sun is low enough to rake across them.</p>

<h2>The Two Chapels Most Visitors Skip</h2>

<p>At the south end of the middle terrace is the chapel of Hathor, with columns carved as the goddess''s head, cow eared, in a form you will not see much elsewhere on the west bank. Inside are scenes of Hathor as a cow licking the king''s hand.</p>

<p>At the north end is the chapel of Anubis, which has kept its ceiling and therefore its colour. Blue and yellow stars overhead, the jackal god receiving offerings, and a room dark enough that your eyes need a moment.</p>

<p>Both take five minutes. Both are missed by the majority of groups, who go up the ramps, photograph the top terrace and come down.</p>

<p>The upper terrace itself is worth slowing down for. Behind the colonnade of osiride pillars is a court, and behind that a sanctuary cut back into the living rock, which is the oldest architectural idea in the building and the one the whole design is arranged to arrive at.</p>

<p>Access to the sanctuary and to parts of the upper level opens and closes with restoration work. Ask at the gate which sections are open that day rather than finding out at the top of two ramps in full sun.</p>

<!-- OWNER: first-hand paragraph fits well here, on standing in the Anubis chapel out of the sun -->

<h2>Hatshepsut Temple Facts That Change How You Look at It</h2>

<p>The erasure is the one nobody expects. Late in the reign of Thutmose III, some twenty years after her death, her name and image were systematically chiselled out of this building and her statues were smashed and dumped in a pit in front of it.</p>

<p>You can see the damage as you walk. Blank ovals where cartouches were, figures cut back to flat stone, and in places a replacement figure of Thutmose I or II carved over the top.</p>

<p>Why it happened is still argued. The old story of a resentful stepson waiting to take revenge does not fit the twenty year delay. The likelier explanation is dynastic: removing a female king from the record to make the succession run cleanly from father to son to grandson.</p>

<p>The second fact is how much of what you see is restoration. A Polish and Egyptian mission has worked here since 1961, and the upper terrace colonnade in particular has been substantially reassembled from fallen blocks. The work is documented and the joins are visible if you look for them.</p>

<p>The third is the statues. Those smashed pieces were excavated in the 1920s and painstakingly rebuilt, and the large kneeling and standing figures of Hatshepsut now in museums came out of that pit.</p>

<h2>What the Queen Hatshepsut Temple Looked Like When New</h2>

<p>Green, for a start.</p>

<p>The lower terrace had gardens with trees, including the myrrh brought from Punt, and T shaped pools. The ramps and courts were lined with painted sphinxes and standing osiride statues of the king. The white limestone was not bare: the colonnades were painted, and traces survive in the protected corners of the upper level.</p>

<p>Try to see it that way as you walk up. Colour, trees, water, and a processional route running down to the river.</p>

<p>The temple was connected to the east bank by that route once a year, in the Beautiful Festival of the Valley, when the god''s image crossed the Nile and the population came over to picnic and drink at the family tombs in the hills. The building was not a quiet museum piece. It was the end point of a party.</p>

<h2>How Long, and When to Arrive</h2>

<p>Ninety minutes is enough for the terraces, both chapels and the Punt wall at a proper pace. Two hours if you also walk over to the Mentuhotep ruins.</p>

<p>Almost nobody gets ninety minutes. The standard west bank morning allows about forty here, which covers the walk up, a photograph from the middle ramp and a look at whichever colonnade the guide prefers. That is the difference between seeing the temple of hatshepsut and seeing a photograph of it with your own eyes.</p>

<p>Arrive at opening. This is not a general recommendation, it is specific to this building: the bay faces east, the cliff behind it reflects heat back at you, and there is no shade anywhere on the terraces except inside the two chapels. By ten in the morning in spring the stone is uncomfortable to touch.</p>

<p>There is a shuttle from the car park to the foot of the causeway, a few hundred metres, and it is worth taking on the way out rather than the way in.</p>

<p>The mortuary temple of hatshepsut is usually done second on a west bank morning, after the royal tombs, and that order is correct. The tombs are underground and unbearable late. This is above ground and unbearable late. The tombs win the early slot because they cannot be done any other way.</p>

<h2>Where It Sits in a Luxor Plan</h2>

<p>The <a href="/blog/tombs-in-the-valley-of-kings">guide to choosing royal tombs</a> covers the first half of that morning, including which three tombs to buy and why. Hatshepsut''s own tomb, KV20, is not normally on the visitor circuit.</p>

<p>For how the west bank divides against the east across a longer stay, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> is the place to start. Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> give the west bank two mornings, which is what lets this building have ninety minutes rather than forty.</p>

<p>The temple of hatshepsut egypt has restored and re restored over sixty years is not a quick photo stop, though it is very often treated as one. The terraces take ten minutes. The walls take the other eighty.</p>

<h2>What to Look at, in Order</h2>

<p>Walk straight up both ramps to the top terrace first, before the coaches. Look back down the axis from the upper court, because that view along the causeway towards the cultivation is the one the architecture was designed around.</p>

<p>Then come down one level and turn south to the Punt colonnade. Give it twenty minutes. Find the ships, then the stilted houses, then Queen Ati, then the trees being carried.</p>

<p>Then cross to the birth colonnade on the north side of the same terrace.</p>

<p>Then the Hathor chapel, then Anubis for the ceiling and the shade.</p>

<p>On your way out, stop at the deir el bahari temple of Mentuhotep II to the south, which is a ruin of low walls and a few column bases and takes four minutes. It is the building Hatshepsut''s architect was answering, and standing in it is the only way to see that this masterpiece was a remix.</p>

<p>One last instruction. Before you leave the upper terrace, find a cartouche that has been chiselled out, put your hand flat against the blank, and note that somebody stood exactly there with a chisel and orders. That is the part of this building people remember longest.</p>',
  'Three terraces cut into a cliff by a woman who ruled as king, and a set of reliefs recording a trading voyage nobody else thought to carve. Start on the top level and work down.',
  'Culture & History',
  ARRAY['Hatshepsut', 'Deir el Bahari', 'Luxor', 'West Bank']::text[],
  'hatshepsut temple',
  'Hatshepsut Temple at Deir el Bahari: A Full Guide',
  'The hatshepsut temple and the monument people call Deir el Bahari are the same building. What is on the terraces, which reliefs matter, and when to be there.',
  'published',
  '2026-12-01T09:00:00+02:00'::timestamptz,
  '2026-12-01T09:00:00+02:00'::timestamptz AT TIME ZONE 'Africa/Cairo',
  '[{"id":"2991ab49-00ee-523f-ad91-e127f43b50a1","question":"Are Hatshepsut''s temple and Deir el Bahari the same place?","answer":"Yes, 1 monument with 2 names. Deir el Bahari is the Arabic name of the site, taken from a Coptic monastery that later stood there, and the temple itself is Hatshepsut''s mortuary temple, ancient name Djeser Djeseru. If an itinerary lists both as separate stops, it has counted 1 morning twice."},{"id":"bf456604-77d9-536d-a7a7-c6a4091f7ef4","question":"How long do you need at the temple of Hatshepsut?","answer":"About 90 minutes, or 2 hours including the Mentuhotep ruins next door. 10 minutes covers the terraces themselves. The other 80 are the Punt reliefs on the middle terrace, the divine birth colonnade opposite them, and the Hathor and Anubis chapels at either end of the same level."},{"id":"c56524d3-1f9c-5203-b442-f624056a148f","question":"Which is better, Hatshepsut''s temple or the Valley of the Kings?","answer":"They answer different questions and most people do both in 1 morning. The royal tombs are painted interiors and have to be done at opening because of the heat. This is exterior architecture and relief carving on 3 open terraces. If you can only pick 1, the tombs give more, but the temple photographs better."},{"id":"1aad56dd-fba0-59c2-94ba-197808065064","question":"What are the Punt reliefs?","answer":"A carved record of a trading voyage Hatshepsut sent to the land of Punt, probably on the Horn of Africa coast. The south colonnade of the middle terrace shows the ships, the stilted houses of Punt, its ruler with Queen Ati, and a cargo list including 31 living myrrh trees carried aboard with their roots wrapped."},{"id":"86d21cb4-2429-5c61-be61-3957fb24c6a2","question":"Why was Hatshepsut''s name erased from her temple?","answer":"It was chiselled out late in the reign of Thutmose III, roughly 20 years after her death, and her statues were smashed and buried in a pit outside. The old revenge story does not fit that 20 year gap. The likelier reason is dynastic, removing a female king so the succession reads cleanly from father to son."},{"id":"9da4fb7a-d321-5565-9dc2-22b20d398069","question":"What is the best time of day to visit?","answer":"Opening time, without qualification. The temple sits in a bay facing east with a 300 metre cliff behind it that reflects heat back onto the terraces, and there is no shade outside the 2 small chapels. By 10am in spring the stone is uncomfortable to touch, and there is nowhere to escape it."},{"id":"4181b549-e5fa-5117-8e76-806bba346e7b","question":"How much of the temple is original?","answer":"A great deal, but the upper colonnade in particular has been substantially reassembled. A Polish and Egyptian mission has worked on the site since 1961, rebuilding from fallen blocks found on the ground. The restoration is documented rather than disguised, and the joins between ancient and replaced stone are visible up close."},{"id":"59deec34-8202-5902-b5f1-dcc81aa3bf6e","question":"Is Hatshepsut buried at her temple?","answer":"No. A mortuary temple was where a ruler''s cult was maintained, not where the body went. Her tomb, KV20, is in the royal valley on the far side of the same hill, roughly 1 kilometre away through the rock, and it is not normally open to visitors. Her architect Senenmut cut his own tomb under the forecourt."}]'::jsonb,
  'BlogPosting'
),
(
  'memphis-egypt',
  'Memphis Egypt: The Ancient Capital, Not the One in Tennessee',
  '<p>This is about the ancient Egyptian capital on the Nile, roughly twenty five kilometres south of Cairo. Not the city in Tennessee, and not the school of a similar name.</p>

<p>Memphis egypt founded at the point where the valley opens into the Delta was the first capital of a unified country and stayed the administrative centre for most of three thousand years. Today it is a village called Mit Rahina, some palm groves, a museum garden and a very large amount of archaeology under farmland.</p>

<p>The contrast between what it was and what is visible is the single most interesting thing about the place.</p>

<h2>Where Is Memphis Egypt, Exactly</h2>

<p>On the west bank of the Nile, in Giza Governorate, centred on the modern villages of Mit Rahina and Badrashein. By road it is around forty five minutes from central Cairo depending on traffic.</p>

<p>The position was chosen for control rather than comfort. This is the hinge point of the country: the last of the narrow valley and the first of the Delta, where anything moving north or south on the river has to pass. Whoever held it held both halves.</p>

<p>Saqqara is three kilometres away. Dahshur is about ten beyond that. Giza is roughly twenty north. All of them are cemeteries of this one city, which is the fact that reorganises the whole map in your head.</p>

<h2>The Founding, and the Two Names</h2>

<p>Tradition credits the founding to Menes around 3100 BC, the king who unified Upper and Lower Egypt and is usually identified with Narmer. The date is conventional rather than exact and the archaeology is messier than the story.</p>

<p>Its first name was Inebu hedj, the white walls, probably describing a whitewashed mud brick fortification. The name Memphis comes later and by a longer route: Men nefer, enduring and beautiful, was the name of the pyramid town of Pepi I at Saqqara, and it spread to the city as a whole before the Greeks turned it into Memphis.</p>

<p>The temple at the centre was Hut ka Ptah, the house of the spirit of Ptah. The Greeks rendered that as Aigyptos, and that word is why the country is called Egypt in English instead of Misr.</p>

<p>So the modern name of the country is a Greek mangling of the name of one temple in this village.</p>

<!-- OWNER: first-hand paragraph fits well here, on what the drive through Badrashein and Mit Rahina is actually like -->

<h2>What Memphis Ancient Egypt Ran From Here</h2>

<p>Everything, for a long time. Memphis ancient egypt governed from was the seat of the treasury, the granaries, the workshops and the office that organised pyramid building, which was the largest sustained industrial project of the ancient world.</p>

<p>Ptah was the patron god: craftsman, sculptor, the one who made the world by speaking it. His high priest carried the title greatest of the directors of craftsmanship, which tells you what the city thought of itself.</p>

<p>The Apis bull lived in the temple precinct as Ptah made flesh. One animal at a time, chosen by its markings, consulted as an oracle, and on its death embalmed and carried up to Saqqara for burial in a granite sarcophagus weighing tens of tonnes.</p>

<p>Even after Thebes became the religious capital in the New Kingdom, kings were crowned at Memphis and the administration stayed. Thebes had the gods. This place had the paperwork.</p>

<p>The workshops mattered as much as the offices. Sculptors, goldsmiths, faience makers and shipwrights worked here, and the standard of craftsmanship the country is famous for was set in this city and exported up the river.</p>

<p>Foreigners lived here too, in quarters of their own. Phoenicians, Carians and Greeks had communities here in the Late Period, and a Persian garrison sat on the palace mound after 525 BC. This was a port city and a capital at once, a combination Egypt would not have again until Alexandria.</p>

<h2>Why the City Disappeared</h2>

<p>Three reasons, stacked.</p>

<p>The first is material. The city was built almost entirely of mud brick, which returns to mud. Only temples and statues were stone, and stone was valuable.</p>

<p>The second is the founding of Alexandria in 331 BC and the shift of power to the coast, followed centuries later by the founding of Fustat and then Cairo just downriver. A declining city next to a growing one becomes a quarry. Memphis limestone is in medieval Cairo.</p>

<p>The third is water. The Nile has shifted its channel eastwards over the millennia and the water table has risen, so a large part of what remains sits below the groundwater, waterlogged and effectively unexcavatable with current methods.</p>

<p>Herodotus walked around the temple of Ptah in the fifth century BC and described it as vast. Almost none of what he saw is above ground now.</p>

<p>Decline was slow rather than dramatic. The temple of Ptah was still functioning in the Roman period, and the site was a bishopric under Byzantine rule before the Arab conquest. There was no sack, no fire and no abandonment date.</p>

<p>What there was instead was five hundred years of people taking stone from a building nobody was maintaining. By the twelfth century the Arab physician and historian Abd al Latif al Baghdadi was describing the ruins as still astonishing, and complaining that they were being dismantled around him. He was right on both counts.</p>

<h2>Reading a Memphis Egypt Map</h2>

<p>Any memphis egypt map you look at will show three things worth separating in your mind.</p>

<p>First, the modern villages, which sit directly on top of parts of the ancient city. Second, the enclosures of excavated ground: the temple of Ptah area, the palace of Apries on its mound, the embalming house of the Apis bulls. Third, the necropolis strip running along the desert edge to the west, thirty kilometres of it from Giza in the north to Dahshur in the south.</p>

<p>The strip is the part that survived, because it was built in the desert out of stone. The city is the part that did not, because it was built on the floodplain out of mud.</p>

<p>Hold those two facts together and the whole landscape makes sense.</p>

<p>One more thing a map will not show you. The Nile in antiquity ran closer to the desert edge than it does now, so the city stood on the river and the cemeteries stood directly above it on the escarpment. A funeral was a short crossing and a climb, not the journey across farmland it would be today.</p>

<p>The river has moved several kilometres east since then. Every distance on a modern map between the city and its tombs is longer than the one the people who used them walked.</p>

<h2>The Necropolis Belt in One Sentence</h2>

<p>Giza, Abusir, Saqqara and Dahshur are four stretches of a single continuous cemetery serving one city over about a thousand years, with the fashion for where to be buried moving up and down the ridge as each king chose his ground.</p>

<p>Sneferu built at Dahshur in the south. His son Khufu moved twenty kilometres north to Giza. The Fifth Dynasty went to Abusir, in between, and the Sixth came back to Saqqara.</p>

<p>Treating them as four separate sites, which every itinerary does, hides the pattern. They are one cemetery with a very long address, and the address is this city.</p>

<h2>What There Is to See Today</h2>

<p>The museum garden at Mit Rahina, and not a great deal else that is open.</p>

<p>Its two great objects are a fallen limestone colossus of Ramesses II, about ten metres long, displayed on its back in a covered hall with a viewing gallery above it, and an alabaster sphinx of around eighty tonnes standing outside in the garden. Around them are sarcophagi, column capitals, sphinx fragments and the alabaster table on which the Apis bulls were embalmed.</p>

<p>The full detail of what is in the garden, and the order to look at it in, is in the <a href="/blog/open-air-museum-memphis-egypt">guide to the site museum</a>. Allow forty minutes.</p>

<p>Outside the museum enclosure, the excavated areas are mostly closed or unmarked, and what you can see from the road is low brick, water and palms.</p>

<p>The palace of Apries sits on a mound to the north, a Twenty Sixth Dynasty building on a platform that still stands well above the fields. Excavation there has been intermittent for over a century. It is not a visitor site and you will see it, if at all, from the vehicle.</p>

<p>The temple of Ptah enclosure has been dug in patches since the nineteenth century, and its west gate, built by Ramesses II, produced most of the large statuary now in the garden. Groundwater has stopped most of that work.</p>

<p>Whole areas are still unrecorded. This is not a finished excavation with a visitor centre, it is an active problem archaeologists have argued about for a hundred and fifty years, and the reason it looks like farmland is that it is farmland.</p>

<!-- OWNER: first-hand paragraph fits well here, on how guests react to how little is left -->

<h2>Memphis Old Egypt Visitors Expect Versus What Is There</h2>

<p>Manage this before you arrive and the visit is excellent. Do not, and it is a disappointment.</p>

<p>People who book memphis old egypt itineraries are usually picturing a ruined city: streets, foundations, a temple you can walk through. That does not exist here. What exists is a garden of rescued objects beside a working village.</p>

<p>The right way to take it is as the first stop of three. Memphis, then Saqqara, then Dahshur, in that order, as one long day out of Cairo.</p>

<p>Done that way the logic is beautiful. Here is the city. Up the hill is its cemetery, where the officials who worked in these offices were buried. Ten kilometres further are the two pyramids where the technique was worked out by trial and error, covered in the <a href="/blog/dahshur-pyramids-egypt">Dahshur guide</a>.</p>

<p>Done in the other order, or on its own, it is forty minutes looking at a statue.</p>

<h2>Practical Notes</h2>

<p>Tickets are bought at the gate and are cheap by comparison with the headline sites. Card payment has become the norm across the Cairo area, so do not arrive relying on cash.</p>

<p>The garden is flat and short, which makes it one of the easier ancient sites for anyone with limited mobility. There are souvenir stalls between the car park and the entrance and no way to avoid them.</p>

<p>Shade is limited outside the colossus hall. From May to September, do this stop first thing.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo area guide</a> covers how this day compares with the Giza plateau and the museums. Our <a href="/10-day-egypt-tour">longer Egypt itineraries</a> run the three sites as one full day with a proper lunch in between.</p>

<h2>One Thing to Do Before You Leave</h2>

<p>Walk to the edge of the museum enclosure and look east, across the fields, towards the river.</p>

<p>That flat green ground is the city. Not beside it, under it. Streets, workshops, granaries, houses, the temple Herodotus described, all of it a few metres down in wet silt, with a hundred generations of farmers on top.</p>

<p>Then turn and look west at the desert edge, where the pyramids of Saqqara stand up out of the sand in a line.</p>

<p>The dead are visible and the living are not. That is the whole history of this place in one turn of the head, and it takes about fifteen seconds once you know where to stand.</p>',
  'The city that ran Egypt for most of three thousand years is now a village, a palm grove and two extraordinary statues. Here is what happened to it and what is left to see.',
  'Culture & History',
  ARRAY['Memphis', 'Mit Rahina', 'Old Kingdom', 'Ptah']::text[],
  'memphis egypt',
  'Memphis Egypt: The Ancient Capital South of Cairo',
  'Memphis egypt was the country''s first capital, founded around 3100 BC beside the Nile. What survives at Mit Rahina today, and why the cemeteries outlived it.',
  'published',
  '2026-12-05T09:00:00+02:00'::timestamptz,
  '2026-12-05T09:00:00+02:00'::timestamptz AT TIME ZONE 'Africa/Cairo',
  '[{"id":"b07c0781-3b18-544f-955f-a3e121e52661","question":"Where is Memphis in Egypt?","answer":"On the west bank of the Nile about 25 kilometres south of central Cairo, centred on the villages of Mit Rahina and Badrashein in Giza Governorate. The drive takes roughly 45 minutes depending on traffic. Saqqara is 3 kilometres further and Dahshur about 10 beyond that, so all 3 sit on 1 route."},{"id":"9b8a78a0-979b-5bdc-839e-cb929e8382d0","question":"What is the difference between Memphis Egypt and Memphis Tennessee?","answer":"One is an ancient Egyptian city founded around 3100 BC on the Nile, the other an American one named after it in 1819. They share a name and nothing else. Egypt''s Memphis was the capital for most of 3000 years and is now the village of Mit Rahina, 25 kilometres south of Cairo."},{"id":"1d074937-09ca-5f25-8079-92fd636ea9c5","question":"What is left of ancient Memphis today?","answer":"A museum garden and a great deal of unexcavated ground. The garden holds a 10 metre fallen colossus of Ramesses II under a roof, an alabaster sphinx of around 80 tonnes, sarcophagi, column capitals and the Apis bull embalming table. The city itself lies under farmland and villages, much of it below the water table."},{"id":"dd06a4ea-5ba4-5063-ac1e-ab753f3d66d7","question":"Why was Memphis the capital of Egypt?","answer":"Because of where it sits. The site is the hinge between the narrow Nile valley and the Delta, so anything moving north or south on the river passes it, and whoever holds it controls both halves of the country. It was founded as a unification capital around 3100 BC for exactly that reason."},{"id":"7eac8c9e-9150-50ab-af07-32a578be5d81","question":"Which is better to visit, Memphis or Saqqara?","answer":"Saqqara, clearly, and they are not really alternatives. Saqqara is a vast necropolis worth 2 or 3 hours. Memphis takes 40 minutes and is the city those tombs belonged to. Visiting Memphis first is what makes Saqqara legible, so the answer for most people is both, in that order."},{"id":"79d87bfe-ac8c-5dfc-b00f-94ad947c80e3","question":"Why did Memphis disappear?","answer":"3 reasons together. It was built in mud brick, which does not survive. Its stone was quarried away for medieval Cairo after Alexandria and then Fustat drew power elsewhere. And the Nile shifted east while the water table rose, leaving much of the remaining city waterlogged and beyond current excavation methods."},{"id":"60184509-cf0b-5d39-b022-ff6a2b02d13b","question":"Does the word Egypt come from Memphis?","answer":"Indirectly, yes, through 1 temple. The building at the city''s centre was Hut ka Ptah, the house of the spirit of Ptah. Greek speakers rendered that as Aigyptos, which became Egypt in English and its equivalents across Europe. The Arabic name Misr comes from a separate Semitic root thousands of years older."},{"id":"99080fc7-269d-5c67-8c06-966793ce3a3b","question":"How long should you spend at Memphis?","answer":"About 40 minutes, as the first of 3 stops on a day trip. 15 minutes in the colossus hall, 10 at the alabaster sphinx, the rest in the garden. Building 2 hours into a schedule for it wastes time that Saqqara, 3 kilometres up the road, will use far better."}]'::jsonb,
  'BlogPosting'
),
(
  'deir-el-medina',
  'Deir el Medina: The Village That Built the Royal Tombs',
  '<p>A man called Paneb was accused of stealing stone from a royal tomb, of threatening to kill his foreman, and of a list of other offences that runs to a full papyrus. We know this because somebody wrote it down and the paper survived.</p>

<p>Deir el medina is the village where he lived. It sits in a small valley on the Luxor west bank, between the royal cemeteries, and the men who lived here were the craftsmen who cut and painted the tombs of the kings. They were literate, they were well paid, they argued constantly, and they left behind the most detailed record of ordinary life anywhere in the ancient world.</p>

<p>The ruins themselves are low walls. Come for what was found in them.</p>

<h2>What Deir el Medina Actually Was</h2>

<p>A state built company town, walled, with a single street running down the middle and about seventy houses opening off it. At its peak there were perhaps a hundred and twenty. The ancient name was Set Maat, the place of truth.</p>

<p>It was occupied for roughly four hundred and fifty years, from the early Eighteenth Dynasty to the end of the Twentieth, which covers almost the entire period the kings were buried across the hill.</p>

<p>The workforce was organised as two gangs, called the left side and the right side, each with a foreman, and a scribe over both who kept the records. They worked a ten day week: eight days on, two off. During the working days they did not come home, they slept in stone huts on the col above the royal valley, which is a forty minute walk over the top.</p>

<p>Rations were the wage. Grain mostly, plus fish, vegetables, oil and beer, delivered by the state.</p>

<p>Literacy is the detail that changes everything. Most of Egypt could not read, and a workforce that could is the reason this village talks and every other settlement is silent. They wrote to each other, they wrote for each other, and they wrote things down that nobody was ever meant to file.</p>

<p>Women appear in the record in their own right. They owned property, brought lawsuits, lent grain at interest and appear as witnesses. One woman, Naunakhte, left a will disinheriting the children who had not looked after her in old age, naming them.</p>

<!-- OWNER: first-hand paragraph fits well here, on walking the village street and how small the houses are -->

<h2>Why This Site Matters More Than It Looks</h2>

<p>Because of the rubbish.</p>

<p>The villagers wrote on ostraca, flakes of limestone and broken pottery, which were free and lying everywhere. Tens of thousands of them have been recovered, and they are not official documents. They are notes.</p>

<p>Work rosters, and absence registers giving the reason each man missed a day: brewing beer, building his own house, a scorpion bite, his mother is ill, his wife is menstruating.</p>

<p>Laundry lists, sketches of animals, love poetry, a schoolboy''s exercises, complaints about a neighbour''s donkey.</p>

<p>Nothing else from ancient Egypt is remotely like this. The temples tell you what kings wanted recorded and the tombs tell you what people hoped for. These flakes tell you who did not turn up on the fourteenth and why.</p>

<p>A great many of them came out of the Great Pit, a deep shaft the villagers dug at the north end of the site hoping to find water. They never reached it. The hole was used as a dump instead, which is the luckiest failure in Egyptology.</p>

<h2>The First Recorded Strike in History</h2>

<p>In the twenty ninth year of Ramesses III, around 1157 BC, the rations stopped arriving on time.</p>

<p>The men downed tools, walked out of the village and sat down at the mortuary temples, refusing to move until they were paid. It happened more than once that year. The scribe Amennakht recorded it, and the account survives on a papyrus now in Turin.</p>

<p>Read what they actually said and it is startlingly familiar: we are hungry, eighteen days of this month have gone, we have come here because of hunger and thirst, there is no clothing, no fish, no vegetables. Send to the pharaoh and tell him.</p>

<p>This is the oldest documented labour action anywhere. It was staged by skilled workers with leverage, which is to say by the only men in Egypt who knew where the royal tombs were and how to open them.</p>

<h2>The Tombs Above the Village</h2>

<p>They built their own tombs into the slope behind their houses, and they built them well, because it was the one thing they were qualified to do for themselves.</p>

<p>Small chapels with mud brick pyramids on top, and painted chambers below. The decoration is not a cut price version of royal work. It is the same hands, working without a committee.</p>

<p>Sennedjem, TT1, is the one to ask for. A vaulted chamber painted on every surface, with the owner and his wife ploughing and harvesting in the Field of Reeds, the colour as strong as anything on the west bank.</p>

<p>Pashedu, TT3, has the famous image of the owner kneeling to drink from a pool under a heavily laden date palm.</p>

<p>Inherkhau, TT359, has the great cat of Heliopolis killing the serpent Apophis with a knife under a sacred tree, which is the single most reproduced image from deir el medina luxor keeps on this hillside.</p>

<p>Tickets cover them in pairs and which pair is open rotates. Ask at the gate.</p>

<p>The chambers are small and reached by steep, narrow stairs, in a couple of cases barely more than a chute with footholds. Anyone uncomfortable in tight spaces should look at the entrance before committing to the descent, because turning round halfway is awkward with people behind you.</p>

<p>Photography rules vary by tomb and change. There is usually a separate photo ticket where it is permitted at all.</p>

<h2>The Temple That Gave the Place Its Name</h2>

<p>At the north end, inside its own mud brick enclosure, is a small, well preserved stone temple to Hathor, begun under Ptolemy IV and finished by his successors.</p>

<p>It is a thousand years younger than the village. By the time it was built the workmen were long gone.</p>

<p>Centuries later Coptic monks took it over and turned it into a monastery, and that is where the modern name comes from: deir means monastery in Arabic. Deir el-Medina, written with the hyphen in most excavation reports, is the monastery of the town.</p>

<p>So the site is named after the least important thing on it, which happens more often than you would expect.</p>

<!-- OWNER: first-hand paragraph fits well here, on which of the three tombs guests find most affecting -->

<h2>How Long, and Where It Fits</h2>

<p>An hour, or ninety minutes with two tombs and the temple.</p>

<p>It is a second morning site. The royal valley and Hatshepsut have to be done early because of heat, and this valley is small, enclosed and even hotter by mid morning, with no shade at all over the village ruins.</p>

<p>The natural pairing is with the Valley of the Queens, which is ten minutes further south, or with Medinet Habu. The <a href="/blog/tombs-in-the-valley-of-kings">guide to the royal tombs</a> covers the work these men actually did, and the <a href="/blog/hatshepsut-temple">guide to Hatshepsut''s temple</a> covers the other building they walked past every week.</p>

<p>Anyone planning deir el medina egypt has excavated more thoroughly than almost any other settlement should give it a proper hour rather than the fifteen minutes it usually gets. The <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> sets out how the west bank divides across a stay, and our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> build in the second morning that makes this stop possible.</p>

<h2>What to Look At, and in What Order</h2>

<p>Start at the top of the path where you can see the whole village at once. One street, houses either side, the enclosure wall, the cemetery rising behind. It takes thirty seconds and it is the only moment the plan is legible.</p>

<p>Then walk down the street. Look at the doorways, the stairs to roof level, the cellars under the floors, and the first room of each house, which usually held a domestic shrine and, in several cases, a bed built into the wall.</p>

<p>Then go up to whichever tomb is open.</p>

<p>Then the Great Pit, which is fenced and unmarked and looks like nothing. Stand at the edge anyway. Everything we know about Paneb, about the strike, about the man who stayed home because of a scorpion, came out of that hole in the ground as rubbish.</p>

<p>One instruction before you leave: in Sennedjem''s chamber, find the two figures ploughing, and note that the man who painted his own wife into eternity beside him had spent his working life painting other people''s afterlives for a king he had probably never met.</p>',
  'They dug the kings into the rock, then went home to a street of small houses and wrote everything down. Absence registers, love poems, a strike. It is the most human site in Luxor.',
  'Culture & History',
  ARRAY['Deir el Medina', 'Luxor', 'West Bank', 'Workers Village']::text[],
  'deir el medina',
  'Deir el Medina: The Village of the Tomb Builders',
  'Deir el medina housed the men who cut the royal tombs, and they left the best record of daily life in Egypt. What survives, and which tombs to ask for.',
  'published',
  '2026-12-10T09:00:00+02:00'::timestamptz,
  '2026-12-10T09:00:00+02:00'::timestamptz AT TIME ZONE 'Africa/Cairo',
  '[{"id":"011e53ff-aef5-5f4b-aead-103d017e07d9","question":"What is Deir el Medina?","answer":"The walled village of the craftsmen who cut and decorated the royal tombs at Luxor, occupied for about 450 years from the early Eighteenth Dynasty. Around 70 houses line a single street, with up to 120 at its peak. Its ancient name was Set Maat, the place of truth, and the men worked an 8 day week."},{"id":"4d447041-c335-529d-9fa5-2753bbd6aadd","question":"Is Deir el Medina worth visiting?","answer":"Yes, and it is the most human site on the west bank. The ruins themselves are low walls, so the value is in what was found here: tens of thousands of written notes covering wages, absences, lawsuits and love poems. Allow 90 minutes with 2 of the painted tombs and the small Ptolemaic temple."},{"id":"ec1147c3-277b-52b1-84fc-3b22c5bf03f6","question":"Which is better, Deir el Medina or the Valley of the Kings?","answer":"The royal valley for spectacle, this village for understanding it. They are 2 halves of 1 story, since the men who lived here cut those tombs and walked over the hill to work. If you have 2 west bank mornings, do the tombs first and the village second, when you know what they made."},{"id":"4efe1cef-5a7a-5a06-bf6a-3227654c8d58","question":"Which tombs are open at Deir el Medina?","answer":"Usually 2 of 3, sold in pairs and rotated. Sennedjem TT1 has a vaulted chamber painted on every surface with the owner ploughing in the Field of Reeds. Pashedu TT3 shows him drinking from a pool under a date palm. Inherkhau TT359 has the great cat killing the serpent Apophis."},{"id":"9d2558ba-dd55-50de-84d9-47f7759123aa","question":"What are ostraca and why do they matter?","answer":"Flakes of limestone and broken pottery used as free scrap paper by the villagers. Tens of thousands survive, many from 1 rubbish filled shaft, and they are notes rather than official records: work rosters, absence registers giving reasons such as a scorpion bite, laundry lists, sketches and poetry. Nothing else from ancient Egypt records daily life at this level."},{"id":"ea0b3781-4da2-5544-a68b-774adf803281","question":"Was there really a strike in ancient Egypt?","answer":"Yes, in year 29 of Ramesses III, around 1157 BC. Rations arrived late, the workmen walked out and sat down at the mortuary temples until they were paid, and it happened more than once that year. The scribe Amennakht wrote it up on a papyrus now in Turin. It is the oldest documented labour action known."},{"id":"fecf30c7-30c8-5c11-a2b7-f15bfa796a4b","question":"Why is it called Deir el Medina if it was a workers village?","answer":"Because the name describes a later building. Deir means monastery in Arabic, and Coptic monks took over the small Ptolemaic temple of Hathor at the north end of the site centuries after the village was abandoned. The temple is roughly 1000 years younger than the houses it is named for."},{"id":"9244f81a-0cd9-5ddf-8253-f3326ca49ba0","question":"How long do you need at Deir el Medina?","answer":"About 60 minutes for the village and temple, or 90 with 2 tombs. The site is compact, with 1 street to walk and a short climb to the cemetery. There is no shade over the ruins and the valley is enclosed, so it is hotter by 10am than most west bank sites."}]'::jsonb,
  'BlogPosting'
),
(
  'bahariya-oasis-egypt',
  'Bahariya Oasis Egypt: Springs, Golden Mummies and Black Hills',
  '<p>A donkey fell through the ground here in 1996 and landed in a cemetery holding several hundred gilded mummies.</p>

<p>That is the story everyone tells about bahariya oasis egypt keeps in its Western Desert, and the frustrating thing is that it has become the only story. Most visitors arrive after four hours on the Cairo road, change vehicles, and drive straight out into the sand without stopping. The oasis is treated as a fuel station with palm trees.</p>

<p>It is a basin fifteen kilometres across with hot springs, a Twenty Sixth Dynasty necropolis, a temple carrying Alexander''s name and a hill made largely of iron. Give it a night.</p>

<h2>Where Bahariya Oasis Egypt Sits</h2>

<p>About three hundred and sixty five kilometres southwest of Cairo, on good tarmac the whole way, which is four to five hours by road. The main town is Bawiti and the population of the whole depression is somewhere around thirty thousand.</p>

<p>It is the closest of the Western Desert oases to the capital, which is why it became the gateway to the White Desert rather than Farafra, which is actually nearer to the chalk.</p>

<p>Bahariya oasis sits in a depression roughly ninety kilometres long and fifteen wide, ringed by escarpments, with the cultivated ground concentrated in the north around Bawiti and a string of smaller villages beyond it. The floor of the basin is around a hundred metres below the plateau you drive in across.</p>

<p>The basin is lower than the surrounding plateau, which is why there is water at all. Groundwater from the Nubian Sandstone aquifer reaches the surface here through springs and boreholes, and the date palms, olives and apricots follow the water.</p>

<h2>The Springs</h2>

<p>Several, and they are not all the same thing.</p>

<p>The hot springs run genuinely hot, in places too hot to get into without waiting, and they come from deep boreholes. Bir Sigam, out on the Cairo road, is the best known of them. Sitting in one at night with the temperature near freezing outside is the strongest argument for staying over.</p>

<p>The cold springs are for swimming rather than soaking. Bir al Ghaba, in a palm grove northeast of town, is the one most often visited.</p>

<p>A practical note that matters more than it should: these are public or semi public places in a conservative rural community. Women swimming will want to be covered, and the hotels with their own spring fed pools exist partly to solve that problem.</p>

<!-- OWNER: first-hand paragraph fits well here, on a specific evening at one of the hot springs -->

<h2>The Valley of the Golden Mummies</h2>

<p>Found in 1996, excavated from 1999, and genuinely one of the largest cemetery discoveries made in Egypt in the last century.</p>

<p>It is Greco Roman, not pharaonic, dating from roughly the first to the fourth century AD, when the oasis was wealthy from wine and dates. Estimates of how many burials the site holds run into the thousands and only a fraction has been excavated.</p>

<p>The name comes from the cartonnage masks: gilded faces over painted chest plates, some in a Roman portrait style and some in the older Egyptian idiom, often in the same tomb.</p>

<p>The excavated valley itself is not open for general visiting. A selection of the mummies is displayed in a small museum in Bawiti, which is a modest building with poor lighting and an extraordinary collection in it.</p>

<p>Stand in front of the masks for a while. The faces are individual in a way pharaonic work rarely is, because Roman period portraiture was trying to record a particular person rather than an eternal type, and several of them are unmistakably somebody.</p>

<p>The wealth behind the cemetery came from wine. This was a producing region supplying the Nile valley, and the amphora stamps found across bahariya oasis egypt sites are how that trade was traced.</p>

<h2>What Else Is in Bawiti</h2>

<p>Two Twenty Sixth Dynasty tombs are open, belonging to a merchant called Zed Amun ef ankh and his son Bannentiu. They are cut into rock under the modern town, reached by a stair, and the painted astronomical ceiling in the second is worth the climb down.</p>

<p>The temple of Ain el Muftella is a complex of small chapels on the edge of the cultivation, Twenty Sixth Dynasty again, heavily restored and covered by protective roofing.</p>

<p>There is also a small temple that carries the cartouche of Alexander the Great, which is unusual: it is the only known temple in Egypt where he appears in relief as pharaoh. It is ruined and it takes ten minutes.</p>

<p>Gebel al Ingleez, the English Mountain, has the remains of a stone lookout built by a British officer during the First World War to watch for Senussi raiders. The view over the whole depression from up there at sunset is the best in the oasis.</p>

<h2>The Black Hills and the Dinosaurs</h2>

<p>The dark conical hills that start south of town and run for thirty kilometres are the Black Desert, and they are capped with fragments of dolerite weathered out of the rock above.</p>

<p>Gebel Dist and Gebel Maghrafa stand apart from the rest, steep and almost pyramidal. Gebel Dist is where a Cretaceous dinosaur, Paralititan stromeri, was excavated in 2000 and 2001, one of the largest sauropods known. The beds here were mangrove swamp a hundred million years ago.</p>

<p>You will drive past all of this on the way to the chalk. The <a href="/blog/black-and-white-desert-egypt">guide to the two deserts</a> covers what happens after the hills, and why the pair is almost always visited together.</p>

<p>The oasis is where the sand trip is assembled, whichever way you do it. A <a href="/white-desert-luxury-camping">luxury desert camp</a> and a mattress on a rug behind a windbreak both leave from the same handful of yards in Bawiti.</p>

<h2>Bahariya Oasis Hotels and Where to Sleep</h2>

<p>Expect simple. Bahariya oasis hotels are small, family run, often mud brick, and several sit out in the palm groves rather than in town. A few have their own spring fed pools, which is the feature to ask about.</p>

<p>There is no international chain here and there will not be one. The better places are comfortable, clean and quiet, with good home cooking and no bar.</p>

<p>Most desert operators include the oasis night as part of the package, either before or after the sand, and book it for you. A bahariya oasis tour sold from Cairo will normally put you in the same handful of properties.</p>

<p>If you are choosing yourself, the question to ask is how far from Bawiti you are and whether there is a spring on site. Those two things decide the evening.</p>

<p>Heating is the other thing to check in winter. Rooms in bahariya oasis egypt lodges are built for summer heat, with thick walls and small windows, and a December night can be genuinely cold indoors. Ask whether there are extra blankets rather than assuming.</p>

<!-- OWNER: first-hand paragraph fits well here, on which lodge guests remember and why -->

<h2>How Long to Stay</h2>

<p>One night if the desert is the point of the trip. Two if the oasis is.</p>

<p>Two nights gets you the springs properly, the museum, the tombs, the English Mountain at sunset and a morning in the palm groves, which is the part nobody plans and everybody enjoys. The groves are worked by hand, irrigated by channels, and full of birds.</p>

<p>Winter is the season, December through February, with warm days and cold nights. Summer is very hot and the whole region slows down. The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo area guide</a> covers the capital end of the journey, and our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> treat the Western Desert as a block of two or three nights rather than a long day.</p>

<h2>Getting There and Practical Detail</h2>

<p>The road is a single carriageway through open desert with almost nothing on it. Fuel is available at the oasis and at one or two points on the way, and phone signal comes and goes.</p>

<p>Bring cash. Card acceptance in the oasis is limited in a way it no longer is in Cairo or Luxor, and the small hotels, the museum and the springs are cash places.</p>

<p>Take a torch and a warm layer even in the shoulder seasons. Bawiti loses power occasionally and winter nights in the basin are colder than the daytime suggests.</p>

<p>Alcohol is not generally available and it is not a place to go looking for it.</p>

<p>One last thing, and it is the thing to do on the first evening rather than the last: drive up Gebel al Ingleez about forty minutes before sunset, walk the last hundred metres to the ruined lookout, and sit down facing west. From up there you can see the palm basin, the edge of the black hills and, on a clear evening, the pale line where the desert starts. That is the geography of the whole trip in one view, and it makes everything that follows easier to read.</p>',
  'Four hours from Cairo there is a palm basin with hot springs, a cemetery full of gilded mummies and hills made of iron. Almost every visitor drives straight through it.',
  'Destinations',
  ARRAY['Bahariya', 'Western Desert', 'Bawiti', 'Golden Mummies']::text[],
  'bahariya oasis egypt',
  'Bahariya Oasis Egypt: Springs, Mummies, Black Hills',
  'Most people treat bahariya oasis egypt as a fuel stop on the way to the desert. It has hot springs, a Greco Roman cemetery and dinosaurs. Stay a night instead.',
  'published',
  '2026-12-15T09:00:00+02:00'::timestamptz,
  '2026-12-15T09:00:00+02:00'::timestamptz AT TIME ZONE 'Africa/Cairo',
  '[{"id":"4541927c-4b06-54d4-b1a8-903b831ce7a8","question":"Is Bahariya Oasis worth staying in, or just passing through?","answer":"Worth at least 1 night and better with 2. Most visitors change vehicles and drive straight out to the desert, which misses the hot springs, the Greco Roman mummy museum, 2 open Twenty Sixth Dynasty tombs and the sunset view from the English Mountain. The springs alone justify the stop."},{"id":"ff437b03-2fbc-5d0c-80d1-113099edae09","question":"How far is Bahariya Oasis from Cairo?","answer":"About 365 kilometres southwest, which is 4 to 5 hours by road on tarmac the whole way. It is the closest of the Western Desert oases to the capital, and that proximity is why it became the gateway to the White Desert even though Farafra sits nearer to the chalk formations."},{"id":"c01bf5b3-6f27-5842-a4f9-6aed8b555a43","question":"What are the Golden Mummies of Bahariya?","answer":"A Greco Roman cemetery found in 1996 and excavated from 1999, dating roughly from the 1st to the 4th century AD. The name comes from gilded cartonnage masks over painted chest plates. Estimates run into the thousands of burials with only a fraction excavated, and a selection is displayed in a small museum in Bawiti."},{"id":"60ae6429-d5a0-5edc-aa9c-5a8d41ad23d2","question":"Which is better, Bahariya or Siwa?","answer":"Bahariya for a short trip, Siwa for a real one. Bahariya is 4 to 5 hours from Cairo and works as a 2 night stop attached to the desert. Siwa is roughly 10 hours away, has its own language and culture, a fortress town and a salt lake, and deserves 3 or 4 nights on its own terms."},{"id":"1e0d0a79-299f-59ab-8b63-562af01526c1","question":"Can you swim in the springs at Bahariya?","answer":"Yes, in several, and the 2 types are used differently. The cold springs such as Bir al Ghaba are for swimming, and the hot boreholes such as Bir Sigam are for soaking, with some running too hot to enter immediately. These are semi public places in a conservative rural area, so women should plan to swim covered or choose a hotel with its own pool."},{"id":"9ac5ce89-9736-574f-be62-316e03ed631d","question":"What kind of hotels are there in Bahariya?","answer":"Small, simple and family run, often mud brick, with several out in the palm groves rather than in Bawiti itself. There is no international chain and no bar. The 1 feature worth asking about is whether the property has its own spring fed pool, because that decides what the evenings are like."},{"id":"2e1ae67f-0036-52f2-8f94-00b6788a7443","question":"When is the best time to visit Bahariya Oasis?","answer":"December to February, with warm days around 20 degrees and cold nights. That is also the season for the desert camping most visitors combine it with. Summer from June to August is very hot, the region slows down, and most desert operators suspend overnight trips into the sand altogether."},{"id":"5f0e1a52-ff6b-5466-b05d-b4160952d394","question":"Do you need cash in the oasis?","answer":"Yes, and this catches people out. Card acceptance in Bahariya is limited in a way it no longer is in Cairo or Luxor, and the small hotels, the museum, the tomb tickets and the springs are cash places. Draw what you need for 2 or 3 days before leaving the capital."}]'::jsonb,
  'BlogPosting'
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  -- The body is NOT overwritten once images are in it. Re-running a file after
  -- scripts/fill-post-images.ts once deleted every <figure> that script had
  -- inserted, silently, with the file reporting success.
  --
  -- To change the prose of a row that has figures, patch it surgically instead.
  -- See content-updates/blog-generator/README.md.
  body_en = CASE
    WHEN posts.body_en LIKE '%<figure%' THEN posts.body_en
    ELSE EXCLUDED.body_en
  END,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  focus_keyword = EXCLUDED.focus_keyword,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  scheduled_at = EXCLUDED.scheduled_at,
  published_at = EXCLUDED.published_at,
  faqs = EXCLUDED.faqs,
  schema_type = EXCLUDED.schema_type,
  updated_at = now();

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be 4.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt');

SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') ORDER BY scheduled_at;

SELECT 'hatshepsut-temple' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'hatshepsut temple', 'gi')) AS primary_hits
FROM posts WHERE slug = 'hatshepsut-temple';
SELECT 'memphis-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'memphis egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'memphis-egypt';
SELECT 'deir-el-medina' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'deir el medina', 'gi')) AS primary_hits
FROM posts WHERE slug = 'deir-el-medina';
SELECT 'bahariya-oasis-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'bahariya oasis egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'bahariya-oasis-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('hatshepsut-temple', 'memphis-egypt', 'deir-el-medina', 'bahariya-oasis-egypt') ORDER BY slug;
