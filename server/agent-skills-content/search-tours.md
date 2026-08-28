# Search Egypt Tour Packages

Use this skill to find luxury Egypt tour packages matching a traveler's request (destinations, trip length, budget, or travel style).

## How to search

Send a `GET` request to:

```
https://iluxuryegypt.com/api/public/tours
```

Optional query parameter:
- `category` — filter by tour category name (e.g. `Classic Egypt`, `Nile Cruise`).

The response is JSON: `{ "success": true, "tours": [...] }`. Each tour object includes `title`, `slug`, `shortDescription`, `duration`, `price`, `currency`, `destinations` (array of city names), and `category`.

## Fetching a single tour

```
GET https://iluxuryegypt.com/api/public/tours/{slug}
```

Returns full itinerary, inclusions/exclusions, linked hotels, and the tour's hero image.

## Matching a traveler's request

- Filter the `tours` array client-side by `destinations` (city name match) and `duration`/`price` range — the API does not support arbitrary filtering server-side.
- Present `title`, `shortDescription`, `duration`, and `price` as the summary; link to `https://iluxuryegypt.com/{slug}` for the full page.
