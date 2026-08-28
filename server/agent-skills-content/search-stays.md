# Browse Egypt Luxury Hotels & Stays

Use this skill to list or look up luxury hotels and Nile cruises featured on iLuxury Egypt.

## Listing hotels

```
GET https://iluxuryegypt.com/api/hotels
```

Returns `{ "success": true, "hotels": [...] }`. Each hotel includes `name`, `slug`, `location`, `region`, `type`, `rating` (1-5), `priceTier`, `amenities`, and `image`.

## Fetching a single hotel

```
GET https://iluxuryegypt.com/api/hotels/{idOrSlug}
```

Accepts either the hotel's `id` or its `slug`. Returns full details: gallery, facilities, and long-form description.

## Presenting results

- Group by `region` (e.g. Cairo & Giza, Luxor, Aswan) when a traveler asks about a specific area of Egypt.
- Link to `https://iluxuryegypt.com/hotel/{slug}` for the full page.
