# Moadop Herbal Tea, conversion landing page

A rebuilt, mobile-first landing page for Moadop Herbal Tea, replacing the long-form
sales letter at `moadop.com/tst/`.

Static HTML, CSS and vanilla JS. No build step, no dependencies, no server.

## What changed and why

| Area | Before | Now |
| --- | --- | --- |
| Price visibility | Buried near the bottom | In the hero, in a sticky bar, and in the package selector |
| Ingredients | Not listed | All seven botanicals with exact percentages, taken from the pack label |
| NAFDAC claim | Mentioned, unverifiable | Number `A7-102324L` shown, copyable, with the portal result and category stated |
| Testimonials | Numbered audio players with no context | Audio, video and WhatsApp screenshots grouped, labelled, with a disclaimer |
| Order form | One long form | Two grouped steps, inline validation, live order summary, WhatsApp auto-fill |
| FAQ | None | Nine questions, marked up as FAQPage schema |
| Health claims | Cure claims for cataracts and glaucoma | Rewritten to the NAFDAC-registered indication: support for clear and healthy vision |
| SEO | Page titled "tst" | Full meta set, Product / FAQPage / Organization schema, sitemap, robots |
| Page weight | WordPress plus page builder | Static, vendored fonts, lazy images, YouTube facades |

## Health claims

The product is registered with NAFDAC as a **herbal nutraceutical**, number
`A7-102324L`, approved 18 December 2024. The registered indication printed on the pack
is **"For clear and healthy vision."**

A nutraceutical registration does not authorise disease treatment claims. The previous
page stated the tea combats cataracts and glaucoma and restores vision without surgery.
That is outside the registration and carries real regulatory and safety exposure, so the
copy here stays inside the approved indication.

Customer testimonials are kept as they were recorded, because they are authentic, and are
presented as individual experiences with a disclaimer alongside them and in the footer.

## Orders

The form posts to the existing CRM webhook, the same one the current page uses:

```
POST https://app.moadopcrm.com/orders/webhook/
```

All attribution fields are preserved and populated: `gclid`, `fbclid`, `ttclid`,
`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus
`form_id`, `form_identifier`, `media_buyer_id` and `source_url`. Click IDs persist in
`sessionStorage`, so attribution survives a visitor navigating around before ordering.

Package IDs match the CRM exactly:

| ID | Package | Price |
| --- | --- | --- |
| 20 | 1 Pack | ₦18,500 |
| 21 | 2 Packs | ₦29,500 |
| 22 | 3 Packs | ₦43,500 |
| 23 | 4 Packs | ₦54,500 |

### Preview safety

`assets/js/main.js` only posts to the CRM when the hostname is `moadop.com` or
`www.moadop.com`. On GitHub Pages or locally, submitting shows a confirmation and sends
nothing, so demoing the page never creates real orders.

## Analytics

`track()` in `main.js` pushes to `dataLayer`, `fbq` and `gtag` if present, and does
nothing if not. Events: `ViewContent`, `SelectPackage`, `CTAClick`,
`PlayTestimonial`, `InitiateCheckout`, `Purchase`.

Drop the GTM, Meta Pixel or GA4 snippet into `<head>` and the events start flowing. No
other change needed.

## Structure

```
index.html
robots.txt
sitemap.xml
assets/
  css/style.css
  js/main.js
  fonts/            Fraunces + Inter, self-hosted
  img/              product shots, NAFDAC proof, WhatsApp screenshots, herbs
  audio/            seven customer voice notes
```

## Deploying

GitHub Pages, repository Settings → Pages → deploy from `master`, root.

To go live on the real domain, point `moadop.com` at Pages and add a `CNAME` file
containing `moadop.com`. The form then posts to the CRM automatically.

## Mobile

Most traffic arrives from Facebook, Instagram and TikTok on a phone, so the small screen
is the primary layout. Specifically handled:

- Tested at 360px and 375px with no horizontal overflow
- Tap targets at 44px minimum, including footer links and the FAQ rows
- The tall WhatsApp screenshots are capped and expand on tap, instead of running to
  650px each and burying the rest of the page
- Inputs are 16px so iOS does not zoom on focus
- Sticky order bar sized for one thumb, with safe-area inset for notched phones
- A separate breakpoint at 360px, and one for landscape phones

## SEO

- `Product`, `FAQPage`, `Organization`, `WebSite` and `BreadcrumbList` JSON-LD
- `shippingDetails` and `hasMerchantReturnPolicy` on the offer, which is what Google needs
  for free-delivery and returns annotations in shopping results
- Full meta set, Open Graph with image dimensions, Twitter card, geo tags for Nigeria
- Delivery section naming the cities people actually search with ("buy in Port Harcourt"),
  which is real buyer information rather than keyword stuffing
- Self-hosted fonts, preloaded hero image, lazy images, YouTube facades, no render-blocking
  third-party requests

## Recent order notifications

`assets/data/recent-orders.json` drives the notification in the bottom-left. It is meant
to be fed from the CRM, which already holds the real orders.

The file carries a `source` field. While it reads `demo`, the notifications render on
preview hosts only and are **hard-blocked on moadop.com**, the same guard the order form
uses. A notice claiming a purchase that did not happen must never reach a real customer,
and fabricated social proof is also the kind of thing that costs a NAFDAC-registered
brand its credibility if anyone checks. Point the file at a real export and set
`source` to `crm`, and it starts showing genuine orders, which read better anyway because
the places and timings vary naturally.

## Contact details

Taken from the live site's own policy pages, not invented:

- Phone and WhatsApp: +234 913 457 4751
- Email: info@moadop.com
- Address: No 1 Awoyemi Junction, Ologuneru, Ibadan, Oyo State

The footer links to the existing `/privacy/`, `/terms/`, `/disclaimer/` and `/policy/`
pages on moadop.com rather than restating them, so there is one authoritative copy.

Two things to resolve there:

1. **The returns page is a stub.** It promises a full refund but states no window, no
   conditions and no process. The FAQ and the schema here both say 30 days, taken from
   the guarantee badge. Make all three agree.
2. **The company name differs across sources.** The pack says "Moadop Global Ltd", the
   policy pages say "Moadop Wellness Services". Pick one.

## The owner's own policies already agree with this page

Worth knowing before the pitch. The live Terms and Disclaimer pages say the products are
"dietary supplements, not medical treatment" and "do not diagnose, treat, cure, or
prevent any disease", and that statements about benefits "have not been evaluated by
NAFDAC".

The `/tst/` sales page contradicts those pages directly. So the compliant copy here is
not an outside opinion being imposed on the business, it is the business's own published
position, applied to the page that actually takes the money.

## Raise with the owner, in priority order

**1. The NAFDAC registration expires within weeks.** Approved 2024-12-18 on what appears
to be a two year term. The owner's own verification screenshot is cropped at "2026-" so
the exact day is not legible from it, but a third-party audit reads the NAFDAC database as
17 December 2026. Every trust claim on this page rests on that registration being current.
Confirm renewal before any further ad spend.

**2. Registration is not advertising approval.** Being listed in the herbal nutraceutical
category permits the approved indication, "for clear and healthy vision". It does not
authorise the disease claims on the current `/tst/` page, nor the claims in the existing
ad creative (`assets/img/product-pack.jpeg`, "Perfect Remedy for: Glaucoma, Cataracts,
Night Blindness"). That creative is deliberately unused here.

**3. Verify the composition against the approved label.** The percentages here were read
directly off the pack photograph at high magnification and sum to 100%:

| Ingredient | % |
| --- | --- |
| Euphrasia officinalis (Eyebright) | 40 |
| Ginkgo biloba | 20 |
| Curcuma longa (Turmeric) | 10 |
| Garcinia kola (Bitter Kola) | 10 |
| Foeniculum (Fennel) | 10 |
| Daucus carota (Carrot) | 5 |
| Camellia sinensis (Green Tea) | 5 |

An earlier revision of this page had Carrot and Bitter Kola transposed. Fixed. Worth a
final check against the printed label the manufacturer holds.

## Claims deliberately not made

Each of these was available to use and was left out because it cannot be substantiated
from anything verifiable:

- **"Total value ₦53,500"**, the anchor on the original page. No basis was found for the
  figure, so the hero now leads on the real multipack savings, which are arithmetic.
- **"Most popular"** on the 2-pack. Invented. Removed, since no order data supports it.
- **"Best value"** on the 3-pack. The 4-pack has the lower unit price (₦13,625 against
  ₦14,500), so the badges now read "Full month" and "Lowest per pack", both checkable.
- **"Verified customer"** on the voice notes. Purchase verification did not happen, so
  they are labelled "Customer".

If the owner can substantiate any of these, they can go back in.

## Assumption to confirm

The returns schema states a 30 day window, taken from the 30-day guarantee badge used on
the current site. If the real window differs, change `merchantReturnDays` in the JSON-LD
and the FAQ answer together.

## Before launch

- Confirm the ₦18,500 price is current, and that the other page advertising ₦19,500 is a
  deliberate separate campaign
- Confirm the guarantee window in days, and make the refund process match "no questions asked"
- Add real contact details, a privacy policy and delivery terms
- Replace the AI-generated lifestyle photography with real product and customer photos
