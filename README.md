# Vela Maison – Shopify theme

An Online Store 2.0 theme for Vela Maison candles.

| | |
|---|---|
| Primary | Deep forest green `#1F3D2E` |
| Secondary | Warm ivory `#FAF6EC` (page background) |
| Accent | Champagne gold `#C9AE7C` |
| Typography | Cormorant Garamond (serif headings) + Jost (sans body), via Google Fonts |
| Photography | Warm, editorial: tone and frame controlled in theme settings |

Colours, fonts and photo treatment are all editable under **Customize → Theme settings**.

## Import into Shopify from GitHub

1. Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**.
2. Authorise GitHub, choose repository `ecomaura/velamasion` and branch **`shopify-theme`**.
3. Shopify adds the theme to your library. Click **Customize** to preview, then **Publish** when ready.

> The original static site lives on `main`. The theme lives on `shopify-theme`. Connect that branch, not `main`.

Edits made in the Shopify code editor are committed back to the connected branch.

## Set-up checklist

1. **Images.** Every image slot is blank by default and shows a soft placeholder. Add photography in the theme editor (hero, families, elements, gallery, story). Upload product photos in **Products**.
2. **Logo and favicon.** Theme settings → *Logo and favicon*. Without a logo the shop name shows as a wordmark.
3. **Navigation.** Header uses the `main-menu` menu, footer columns use `main-menu` and `footer`. Edit under **Content → Menus**.
4. **Pages.** Create pages in **Content → Pages** and pick a template:
   - *About* → template `page.about`
   - *Contact* → template `page.contact`
   - Any other page → `page`
5. **Collections.** Create a collection (for example "Signature Collection") and select it in the homepage *Featured collection* section.
6. **Product subtitle (optional).** Add a product metafield `custom.subtitle` (single line text) for the italic line under each product name. Without it, the product type is shown.
7. **Filters.** Collection filters come from the free **Search & Discovery** app.
8. **Free shipping bar.** Theme settings → *Cart*. Set the threshold in your shop currency (0 hides it).
9. **Newsletter.** Sign-ups create customers tagged `newsletter`.
10. **Placeholder copy.** The sample reviews, "7 oz soy wax", "Poured in India" and ₹999 shipping text are defaults carried over from the original site. Edit them in the editor.

## Structure

```
assets/      theme.css, sections.css, theme.js, shop.js, favicon
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     en.default.json
sections/    header, footer, cart drawer, homepage sections, main-* page sections
snippets/    css-variables, media, icon, price, product-card, pagination, address-form
templates/   JSON templates + customers/* + gift_card
```

## Notes

- Cart drawer, quick add and variant switching use Shopify's AJAX Cart and Section Rendering APIs: no third-party dependencies.
- Fonts load from Google Fonts. To use another family, type its exact name in Theme settings → Typography.
- Text is written in English directly in the templates. Add translations via `locales/` if you need multiple languages.
