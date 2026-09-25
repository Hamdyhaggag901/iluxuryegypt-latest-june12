import io, re, collections, sys

TARGETS = {
    "5-star-nile-cruise": "5 star Nile cruise",
    "old-winter-palace-luxor-hotel": "Old Winter Palace Luxor hotel",
    "oberoi-sahl-hasheesh": "Oberoi Sahl Hasheesh",
    "four-seasons-hotel-alexandria-egypt": "Four Seasons Hotel Alexandria",
}
A = lambda t: TARGETS[t]

# (source_table, source_slug, target_slug, anchor, sentence with {A})
ROWS = [
 # --- MS Le Fayan -------------------------------------------------------
 ("posts","best-luxury-nile-cruise-egypt","5-star-nile-cruise",A("5-star-nile-cruise"),
  "Among the boats working this stretch of river, the one we reach for when a guest wants the bank visible from the bed is a {A} with floor to ceiling windows in every cabin category rather than portholes."),
 ("posts","luxury-cairo-luxor-aswan-itinerary","5-star-nile-cruise",A("5-star-nile-cruise"),
  "The river leg is the part of this route where the choice of boat changes the week, and a {A} departing Aswan on Mondays or Luxor on Thursdays fits either direction without bending the rest of the plan."),
 ("posts","luxury-egypt-tours","5-star-nile-cruise","MS Le Fayan",
  "Where a journey includes the stretch between Luxor and Aswan we more often use a small ship such as {A} than one of the larger river vessels, because the temples at Esna, Edfu and Kom Ombo sit close enough to the water that the boat is genuinely the transport."),
 ("posts","tailor-made-egypt-tours","5-star-nile-cruise",A("5-star-nile-cruise"),
  "Departures run to a fixed weekly pattern in both directions, which makes a {A} one of the easier fixed points to build a tailored itinerary around."),
 ("posts","best-time-to-visit-egypt","5-star-nile-cruise",A("5-star-nile-cruise"),
  "The months that suit a sailing are narrower than the months that suit Egypt generally, and the sundeck of a {A} is usable for most of the day only between October and April."),
 ("hotels","old-cataract-aswan","5-star-nile-cruise","MS Le Fayan",
  "Sailings north toward Luxor leave from this town, so guests staying here often join {A} on its Monday departure rather than flying on."),

 # --- Sofitel Winter Palace Luxor ---------------------------------------
 ("posts","luxury-cairo-luxor-aswan-itinerary","old-winter-palace-luxor-hotel",A("old-winter-palace-luxor-hotel"),
  "The Luxor nights on this route are the ones where the address decides how early the mornings can start, and the {A} sits on the east bank corniche within walking distance of Luxor Temple."),
 ("posts","best-luxury-nile-cruise-egypt","old-winter-palace-luxor-hotel",A("old-winter-palace-luxor-hotel"),
  "Almost every sailing begins or ends in Luxor, and the {A} is where the land nights on that side of the river usually go."),
 ("posts","planning-a-trip-to-egypt","old-winter-palace-luxor-hotel",A("old-winter-palace-luxor-hotel"),
  "Luxor is the one city where the hotel changes the itinerary rather than only the comfort, and at the {A} the wing you book matters more than the room category."),
 ("posts","luxury-egypt-tours","old-winter-palace-luxor-hotel","Sofitel Winter Palace Luxor",
  "The Victorian river palaces are a distinct kind of stay in Egypt, and {A} is the one on the east bank facing the Theban necropolis across the water."),
 ("posts","best-time-to-visit-egypt","old-winter-palace-luxor-hotel","Sofitel Winter Palace Luxor",
  "October to April is the working season in Luxor, and it is also when the royal gardens behind {A} are usable through the closed middle of the day."),
 ("hotels","old-cataract-aswan","old-winter-palace-luxor-hotel",A("old-winter-palace-luxor-hotel"),
  "Travellers doing the classic route generally stay in both of Egypt's Victorian river palaces, and the {A} is the Luxor half of that pair."),
 ("hotels","mena-house-hotel-egypt","old-winter-palace-luxor-hotel",A("old-winter-palace-luxor-hotel"),
  "Guests who choose a historic hotel in Giza tend to want the same in Luxor, which is the {A} on the east bank corniche."),

 # --- The Oberoi Sahl Hasheesh ------------------------------------------
 ("posts","egypt-honeymoon","oberoi-sahl-hasheesh",A("oberoi-sahl-hasheesh"),
  "Couples finishing a temples itinerary often add three nights at the {A}, where every suite has a private courtyard or garden of its own and some have private pools."),
 ("posts","tailor-made-egypt-tours","oberoi-sahl-hasheesh","The Oberoi at Sahl Hasheesh",
  "The last three nights are the part of a tailored itinerary most often got wrong, and an all suite Red Sea property such as {A} is the usual correction."),
 ("posts","planning-a-trip-to-egypt","oberoi-sahl-hasheesh",A("oberoi-sahl-hasheesh"),
  "If the trip runs eight days or more, three nights at the {A} are worth more than another site, because the classic route through Cairo, Luxor and Aswan is dense and starts early every morning."),
 ("posts","egypt-travel-tips","oberoi-sahl-hasheesh",A("oberoi-sahl-hasheesh"),
  "The Red Sea season is longer than the Nile Valley season, which is why a stay at the {A} still works in the months that are already too hot for Luxor."),
 ("posts","what-to-pack-for-egypt","oberoi-sahl-hasheesh","The Oberoi at Sahl Hasheesh",
  "A trip that finishes on the coast needs swimwear alongside the covered clothing the temples ask for, particularly at {A}, where the private beach is the centre of the stay."),
 ("hotels","four-seasons-nile-plaza","oberoi-sahl-hasheesh",A("oberoi-sahl-hasheesh"),
  "Guests who begin a trip here frequently end it on the coast, and the {A} is the all suite property we use south of Hurghada for that."),
 ("hotels","fairmont-nile-city","oberoi-sahl-hasheesh",A("oberoi-sahl-hasheesh"),
  "A Cairo start and a Red Sea finish is the shape most long Egypt itineraries settle into, and the second half of that usually lands at the {A}."),

 # --- Four Seasons Hotel Alexandria -------------------------------------
 ("posts","private-tours-in-cairo-egypt","four-seasons-hotel-alexandria-egypt",A("four-seasons-hotel-alexandria-egypt"),
  "Alexandria is normally attempted as a day trip from the capital, which leaves about four usable hours after the drive each way, and a night at the {A} buys back the evening along the corniche that a day tripper always misses."),
 ("hotels","four-seasons-nile-plaza","four-seasons-hotel-alexandria-egypt",A("four-seasons-hotel-alexandria-egypt"),
  "Guests who want the same brand on the Mediterranean will find the {A} doing an entirely different job, as a pause rather than as a base for a dense city."),
 ("hotels","four-seasons-first-residence-cairo","four-seasons-hotel-alexandria-egypt","Four Seasons Hotel Alexandria at San Stefano",
  "The other property of this brand worth knowing about in Egypt sits on the coast, where the {A} has a private beach and rooms facing north over the sea."),
 ("hotels","cairo-marriott-hotel","four-seasons-hotel-alexandria-egypt",A("four-seasons-hotel-alexandria-egypt"),
  "Alexandria sits at the far end of the desert road from here, and the {A} is the seafront base that makes an overnight worth more than a day trip."),
 ("hotels","sofitel-cairo-nile-el-gezirah","four-seasons-hotel-alexandria-egypt",A("four-seasons-hotel-alexandria-egypt"),
  "Guests adding the Mediterranean coast to a Cairo stay usually do it from the {A} at San Stefano, a short drive from the Bibliotheca Alexandrina and Qaitbay Citadel."),
 ("hotels","kempinski-nile-hotel-cairo","four-seasons-hotel-alexandria-egypt",A("four-seasons-hotel-alexandria-egypt"),
  "The second city is a different proposition from this one, and two nights at the {A} is the shortest stay that makes the journey north worthwhile."),
 ("hotels","waldorf-astoria-cairo-heliopolis","four-seasons-hotel-alexandria-egypt","Four Seasons Hotel Alexandria at San Stefano",
  "For guests continuing to the coast rather than to the Nile, the {A} is the seafront property we use in the second city."),
]

# Step 4: the reverse links, one appended paragraph per new page, one sentence.
REVERSE = [
 ("5-star-nile-cruise",
  'Most guests give the river a few nights on land at either end, which is where the <a href="/blog/luxury-cairo-luxor-aswan-itinerary">Cairo, Luxor and Aswan itinerary</a>, the wider <a href="/blog/best-luxury-nile-cruise-egypt">comparison of Nile cruise boats</a> and the <a href="/hotel/old-winter-palace-luxor-hotel">Old Winter Palace Luxor hotel</a> all come in.'),
 ("old-winter-palace-luxor-hotel",
  'The Luxor nights usually sit either side of a sailing, so the <a href="/blog/luxury-cairo-luxor-aswan-itinerary">Cairo, Luxor and Aswan itinerary</a> and the <a href="/hotel/5-star-nile-cruise">5 star Nile cruise</a> that departs from here on Thursdays are the two pages to read next.'),
 ("oberoi-sahl-hasheesh",
  'The beach nights only make sense against what comes before them, so the <a href="/blog/best-luxury-nile-cruise-egypt">comparison of Nile cruise boats</a> and the <a href="/hotel/5-star-nile-cruise">5 star Nile cruise</a> we use between Luxor and Aswan are the pages that decide whether three nights here have been earned.'),
 ("four-seasons-hotel-alexandria-egypt",
  'Alexandria works best as the pause between the capital and the river, so the <a href="/blog/private-tours-in-cairo-egypt">three days Cairo actually needs</a> and the <a href="/hotel/four-seasons-nile-plaza">Four Seasons Nile Plaza</a> are the two pages to set against it.'),
]

lines = []
for table, slug, target, anchor, sentence in ROWS:
    link = '<a href="/hotel/%s">%s</a>' % (target, anchor)
    para = "<p>%s</p>" % sentence.replace("{A}", link)
    col = "body_en" if table == "posts" else "article"
    lines.append("UPDATE %s SET %s = %s || $L$%s$L$, updated_at = now() WHERE slug = '%s';" % (table, col, col, para, slug))
for slug, sentence in REVERSE:
    lines.append("UPDATE hotels SET article = article || $L$<p>%s</p>$L$, updated_at = now() WHERE slug = '%s';" % (sentence, slug))

io.open("internal-links.sql", "w", encoding="utf8").write("\n".join(lines) + "\n")
print("wrote %d statements" % len(lines))
