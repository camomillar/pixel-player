# songs 4u <3

A personal project inspired by an old, lovely tradition: making someone a mixtape.

Pick some songs, write a message, choose a cover and a colour, and get back a link that opens
like a little CD jewel case — with the songs playable right there. Made for Valentine's Day, but
honestly, any day is a good day to make someone a playlist. ♥

**Try it:** [www.songs4u.online](https://www.songs4u.online)

---

## What it does

**Making a playlist**
- Add a "from" and "to", a title, and a short message
- Search for songs (search and previews are powered by [Deezer](https://www.deezer.com)) and add
  up to 10
- Pick a background colour and a "vibe" (floating hearts, stars, notes, or flowers)
- Pick a few stickers to decorate the cover, and optionally upload a cover photo
- Generate a link and a QR code to send it

**Opening a playlist**
- The link opens a jewel case that flips open on click, with the cover on one side and a CD you
  can spin and play on the other
- 30-second previews play right in the browser, track by track
- The recipient can export the CD art as an Instagram Story image with one tap
- The link also works as a QR code, handy for a physical card or gift

Playlists are stored for one year and then deleted automatically. There's no login and no
account — the link itself is the key, so treat it like one.

## Tech stack

- **[Next.js](https://nextjs.org) 16** (App Router) + **React 19** + **TypeScript**
- **[Deezer API](https://developers.deezer.com/)** for song search, album art, and previews — no
  API key needed
- **[Upstash Redis](https://upstash.com)** to store playlists behind their short links
- **[PostHog](https://posthog.com)** for analytics, opt-in only (see [Privacy](#privacy--analytics) below)
- **[Vercel](https://vercel.com)** for hosting and Vercel Analytics
- `lz-string` to compress playlists into shareable URLs, `html2canvas`/`html-to-image` for the
  Instagram Story export, `qrcode` for the QR codes

## Getting started

```bash
git clone https://github.com/camomillar/songs4u.git
cd songs4u
npm install
```

Copy the environment example and fill in your own keys:

```bash
cp .env.local.example .env.local
```

| Variable | Required | What it's for |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes | Playlist storage — get one free at [upstash.com](https://upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Paired with the URL above |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | No | Enables analytics; without it, analytics is simply inactive |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Your PostHog instance host |

Song search and previews use the public Deezer API and need no key.

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build` to build for production, `npm run start` to run that build.

## Project structure

```
app/
  page.tsx             the playlist creator form
  s/[id]/               the short share link (/s/<id>) — current format
  share/                legacy share links (/share?d=<encoded>) — still supported
  privacy/              the privacy & cookies page
  api/
    playlist/            save/load a playlist (Upstash)
    search/               Deezer song search
    preview-urls/         refreshes expired Deezer preview URLs
components/
  JewelCase.tsx          the CD jewel case UI — the heart of the recipient-facing view
  StoryCard.tsx          renders the Instagram Story export
  SharePageContent.tsx   wraps JewelCase with playback state for a shared link
  CookieConsent.tsx      the analytics consent banner
lib/
  encode.ts              compress/decompress a playlist for the legacy link format
  redis.ts               Upstash client
  consent.ts             cookie-consent storage helper
```

## Privacy & analytics

Analytics (PostHog) only runs if a visitor accepts the cookie banner — nothing is captured and no
analytics cookie is set otherwise. The full breakdown of what's stored and for how long lives at
[songs4u.online/privacy](https://www.songs4u.online/privacy).

## Made by

[Camilla Almeida](https://www.linkedin.com/in/almeida-camilla/) — this is a personal project, not
accepting outside contributions right now, but feel free to open an issue if something's broken.
