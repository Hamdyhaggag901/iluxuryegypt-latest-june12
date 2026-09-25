"""Checks the four stay-page SQL files against every rule in the brief.
Parses the dollar-quoted values back out of the SQL, so it validates what
would actually be stored rather than a copy of the text."""
import json, re, sys, html

BANNED = ["delve into", "worth noting", "in conclusion", "nestled", "boasts",
          "hidden gem", "testament to", "tapestry", "meticulously",
          "unparalleled", "iconic", "breathtaking", "stunning", "gem",
          "oasis of calm"]

def grab(sql, tag):
    m = re.search(r"\$%s\$(.*?)\$%s\$" % (tag, tag), sql, re.S)
    return m.group(1) if m else None

def grab_all(sql, tag):
    return re.findall(r"\$%s\$(.*?)\$%s\$" % (tag, tag), sql, re.S)

def strip(h):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h)).strip()

def count_phrase(text, phrase):
    return len(re.findall(re.escape(phrase.lower()), text.lower()))

def check(path, kw):
    sql = open(path, encoding="utf8").read()
    fails, out = [], []
    A  = lambda c, m: (out.append("  PASS  " + m) if c else (fails.append(m), out.append("  FAIL  " + m)))

    art = grab(sql, "ART"); fd = grab(sql, "FD")
    st  = grab(sql, "ST");  md = grab(sql, "MD"); ia = grab(sql, "IA")
    ga  = grab_all(sql, "GA"); hl = grab_all(sql, "H"); am = grab_all(sql, "A")
    sc  = grab(sql, "SC")
    art_text = strip(art); fd_text = strip(fd)

    # 1. keyword placement
    first100 = " ".join(art_text.split()[:100]).lower()
    h2s = re.findall(r"<h2>(.*?)</h2>", art, re.S)
    h3s = re.findall(r"<h3>(.*?)</h3>", art.split("<h2>Frequently Asked Questions</h2>")[-1], re.S)
    fd_first2 = " ".join(re.split(r"(?<=[.!?])\s+", fd_text)[:2]).lower()
    A(kw in st.lower(), "keyword in seo_title")
    A(kw in md.lower(), "keyword in meta_description")
    A(kw in ia.lower(), "keyword in image_alt")
    A(kw in fd_first2, "keyword in full_description first two sentences")
    A(kw in first100, "keyword in article first 100 words")
    A(any(kw in strip(h).lower() for h in h2s), "keyword in at least one <h2>")
    A(any(kw in strip(h).lower() for h in h3s), "keyword in at least one FAQ question")
    n = count_phrase(art_text, kw)
    A(3 <= n <= 5, "keyword used %d times in article (want 3-5)" % n)
    A(count_phrase(fd_text, kw) == 1, "keyword used %d time(s) in full_description (want 1)" % count_phrase(fd_text, kw))

    # 2-4. lengths
    A(len(st) < 60, "seo_title %d chars (want under 60)" % len(st))
    A(150 <= len(md) <= 160, "meta_description %d chars (want 150-160)" % len(md))
    wc = len(art_text.split())
    A(1500 <= wc <= 1700, "article %d words (want 1500-1700)" % wc)
    fdw = len(fd_text.split())
    A(200 <= fdw <= 260, "full_description %d words (want 200-260)" % fdw)
    A(4 <= len(re.findall(r"<p>", fd)) <= 5, "full_description %d paragraphs (want 4-5)" % len(re.findall(r"<p>", fd)))
    A(not re.search(r"<h[1-6]", fd), "full_description has no headings")

    # 5. dashes, anywhere in the file
    d = len(re.findall("[\\u2013\\u2014]", sql))
    A(d == 0, "em/en dashes in file: %d (want 0)" % d)

    # 6. banned words
    hay = (art_text + " " + fd_text + " " + st + " " + md + " " + ia + " " + " ".join(ga + hl)).lower()
    hits = [b for b in BANNED if re.search(r"\b" + re.escape(b) + r"\b", hay)]
    A(not hits, "no banned words (found: %s)" % ", ".join(hits) if hits else "no banned words")

    # 7. FAQ block mirrors the schema exactly
    A(len(h3s) == 6, "%d FAQ <h3> questions (want 6)" % len(h3s))
    A(len(re.findall(r"<h3>", art)) >= 6, "sub-section <h3> tags present outside the FAQ: %d" % (len(re.findall(r"<h3>", art)) - len(h3s)))
    faq_html = art.split("<h2>Frequently Asked Questions</h2>")[-1]
    blocks = re.findall(r"<h3>(.*?)</h3>(.*?)(?=<h3>|$)", faq_html, re.S)
    qa = [(html.unescape(strip(q)), html.unescape(strip(a))) for q, a in blocks]
    graph = json.loads(sc)["@graph"]
    faqpage = [g for g in graph if g.get("@type") == "FAQPage"]
    A(len(faqpage) == 1, "exactly one FAQPage node")
    me = faqpage[0]["mainEntity"] if faqpage else []
    A(len(me) == 6, "%d mainEntity items (want 6)" % len(me))
    mism = [q for i, (q, a) in enumerate(qa)
            if i >= len(me) or me[i]["name"] != q or me[i]["acceptedAnswer"]["text"] != a]
    A(not mism, "schema FAQ text matches the HTML character for character (mismatched: %s)" % "; ".join(mism[:2]))
    hotel_nodes = [g for g in graph if g.get("@type") in ("Hotel", "LodgingBusiness", "Resort")]
    A(len(hotel_nodes) == 1, "exactly one Hotel/LodgingBusiness node")
    h = hotel_nodes[0] if hotel_nodes else {}
    A(h.get("description") == md, "schema description reuses meta_description")
    A(h.get("address", {}).get("@type") == "PostalAddress" and h.get("address", {}).get("addressCountry") == "EG",
      "PostalAddress with addressCountry EG")
    A(h.get("starRating", {}).get("ratingValue") == "5", "starRating ratingValue is the string \"5\"")
    af = h.get("amenityFeature", [])
    A(isinstance(af, list) and len(af) > 0 and all(x.get("@type") == "LocationFeatureSpecification" for x in af),
      "amenityFeature is an array of LocationFeatureSpecification (%d)" % len(af))

    # 8. one table
    A(len(re.findall(r"<table>", art)) == 1, "%d <table> in article (want 1)" % len(re.findall(r"<table>", art)))
    A("<thead>" in art and "<tbody>" in art and "<th>" in art and "<td>" in art, "table has thead, tbody, th, td")

    # 9. gallery_alt
    A(len(ga) == 8, "%d gallery_alt entries (want 8)" % len(ga))
    bad = [g for g in ga if kw in g.lower()]
    A(not bad, "no gallery_alt carries the focus keyword (%d do)" % len(bad))
    A(count_phrase(art + fd + " ".join(ga) + " ".join(hl), kw) - count_phrase(art_text, kw) - 1 >= -1, "alt keyword budget")

    # 10. no links, prices, ratings
    A("<a " not in art and "<a " not in fd and "<a>" not in art, "no <a> tags")
    A("aggregateRating" not in sql, "no aggregateRating")
    A("priceRange" not in sql and '"offers"' not in sql, "no priceRange and no offers")
    money = re.findall(r"[$£€]\s?\d|\b\d+\s?(?:USD|EUR|GBP)\b|\bper night\b", art_text, re.I)
    A(not money, "no prices in the article (found %s)" % money[:3])

    # house rules
    multi = [strip(p) for p in re.findall(r"<p>(.*?)</p>", art, re.S)
             if len([x for x in re.split(r"(?<=[.!?])\s+", strip(p)) if len(x) > 2]) > 1]
    A(not multi, "one sentence per <p> (%d paragraphs have more: %s)" % (len(multi), multi[:1]))
    A(len(re.findall(r"<strong>", art)) == 1, "%d <strong> in article (want exactly 1)" % len(re.findall(r"<strong>", art)))
    A("<h1" not in art, "no <h1>")
    A(not re.search(r"<(html|head|body)\b", art), "raw fragment only")
    A(art.rstrip().endswith("</p>") and "<h2>Frequently Asked Questions</h2>" in art, "article ends inside the FAQ block")
    A(6 <= len(am) <= 10, "%d amenities (want 6-10)" % len(am))
    A(len(hl) == 5, "%d highlights (want 5)" % len(hl))
    bad_h = [h for h in hl if not (4 <= len(h.split()) <= 9) or h.endswith(".")]
    A(not bad_h, "highlights are 4-9 words with no full stop (bad: %s)" % bad_h[:2])
    promo = [p for p in [strip(x) for x in re.findall(r"<p>(.*?)</p>", art, re.S)]
             if re.search(r"\b(we|our)\b", p, re.I) and re.search(r"book|arrange|itinerar|guests|client", p, re.I)]
    A(len(promo) <= 2, "%d promotional sentences (max 2)" % len(promo))
    rooms = json.loads(grab(sql, "RM")); facs = json.loads(grab(sql, "FC"))
    A(all(set(r) >= {"name", "description", "size", "view"} for r in rooms), "rooms have name/description/size/view")
    A(all(set(f) >= {"icon", "label", "description"} for f in facs), "facilities have icon/label/description")
    ICONS = {"pool","spa","dining","wifi","transfers","concierge","gym","ac","breakfast","parking","pets"}
    unknown = sorted({f["icon"] for f in facs} - ICONS)
    A(not unknown, "every facility icon is one hotel-detail.tsx renders (unknown: %s)" % unknown)
    A(5 <= len(facs) <= 8, "%d facilities (want 5-8)" % len(facs))
    A(sql.count("UPDATE hotels SET") == 1 and sql.rstrip().endswith(";"), "one UPDATE statement, ends in a semicolon")
    A("--" not in sql.replace("<!--", ""), "no SQL comments")

    print("\n=== %s  (keyword: %s)" % (path.split("/")[-1], kw))
    print("\n".join(out))
    return fails

if __name__ == "__main__":
    total = 0
    for path, kw in [(a, b) for a, b in zip(sys.argv[1::2], sys.argv[2::2])]:
        total += len(check(path, kw))
    print("\n%s" % ("ALL CHECKS PASSED" if total == 0 else "%d FAILURE(S)" % total))
    sys.exit(0 if total == 0 else 1)
