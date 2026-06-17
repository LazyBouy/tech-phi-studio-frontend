/**
 * CMS FIXTURES (CH-04b) — mock Wagtail content matching the CH-03b types.
 * ---------------------------------------------------------------------------
 * Lorem ipsum copy + placeholder renditions; these stand in for real Figma
 * pages until CH-10 pins actual content/imagery. Typed against CmsPage/CmsBlock
 * so any contract drift fails the build.
 */

import type { ImageRendition } from "@/types/api";
import type {
  CmsBlock,
  HomePage,
  ServiceDetailPage,
  ServicesIndexPage,
} from "@/types/cms";

let blockSeq = 0;
const blockId = () => `blk-${(blockSeq += 1).toString().padStart(3, "0")}`;

function rendition(w: number, h: number, alt: string): ImageRendition {
  return { url: `https://picsum.photos/seed/${w}x${h}/${w}/${h}`, width: w, height: h, alt };
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/* ---- shared meta/seo helpers -------------------------------------------- */
function meta(type: string, slug: string) {
  return {
    type,
    detail_url: `https://mock.local/api/v2/pages/?slug=${slug}`,
    html_url: `https://mock.local/${slug === "home" ? "" : slug}`,
    slug,
    first_published_at: "2026-01-15T09:00:00Z",
  };
}
const seo = (title: string) => ({
  seo_title: `${title} — Tech Phi Studio`,
  search_description: LOREM.slice(0, 120),
  og_image: rendition(1200, 630, `${title} social card`),
});

/* ---- HomePage ----------------------------------------------------------- */
const homeBody: CmsBlock[] = [
  { id: blockId(), type: "rich_text", value: `<h1>Engineering with philosophy</h1><p>${LOREM}</p>` },
  {
    id: blockId(),
    type: "cta",
    value: {
      heading: "Start your project",
      text: "Tell us what you're building.",
      button_label: "Take the quiz",
      button_url: "/quiz",
    },
  },
  {
    id: blockId(),
    type: "two_column",
    value: {
      left_column: [
        { id: blockId(), type: "rich_text", value: `<h3>Design</h3><p>${LOREM}</p>` },
      ],
      right_column: [
        { id: blockId(), type: "image", value: { image: rendition(600, 400, "Studio workspace"), caption: "Our studio" } },
      ],
    },
  },
  { id: blockId(), type: "quote", value: { quote: "They build like they mean it.", attribution: "A happy client" } },
];

export const homePage: HomePage = {
  id: 2,
  title: "Home",
  slug: "home",
  meta: meta("cms.HomePage", "home"),
  ...seo("Home"),
  body: homeBody,
};

/* ---- ServiceDetailPage -------------------------------------------------- */
export const serviceDetailPage: ServiceDetailPage = {
  id: 11,
  title: "Web Engineering",
  slug: "web-engineering",
  meta: meta("cms.ServiceDetailPage", "web-engineering"),
  ...seo("Web Engineering"),
  intro: LOREM,
  hero_image: rendition(1440, 720, "Web engineering hero"),
  card_image: rendition(600, 400, "Web engineering card"),
  body: [
    { id: blockId(), type: "rich_text", value: `<p>${LOREM}</p>` },
    {
      id: blockId(),
      type: "video_embed",
      value: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Process overview" },
    },
  ],
};

/* ---- ServicesIndexPage + children --------------------------------------- */
export const servicesIndexPage: ServicesIndexPage = {
  id: 10,
  title: "Services",
  slug: "services",
  meta: meta("cms.ServicesIndexPage", "services"),
  ...seo("Services"),
  body: [{ id: blockId(), type: "rich_text", value: `<h1>What we do</h1><p>${LOREM}</p>` }],
};

export const serviceChildren: ServiceDetailPage[] = [
  serviceDetailPage,
  {
    id: 12,
    title: "Product Design",
    slug: "product-design",
    meta: meta("cms.ServiceDetailPage", "product-design"),
    ...seo("Product Design"),
    intro: LOREM,
    hero_image: rendition(1440, 720, "Product design hero"),
    card_image: rendition(600, 400, "Product design card"),
    body: [{ id: blockId(), type: "rich_text", value: `<p>${LOREM}</p>` }],
  },
];

/** Registry keyed by slug → page, for the MSW handler to resolve ?slug= queries. */
export const pagesBySlug: Record<string, HomePage | ServiceDetailPage | ServicesIndexPage> = {
  home: homePage,
  services: servicesIndexPage,
  "web-engineering": serviceDetailPage,
  "product-design": serviceChildren[1],
};

/** Children keyed by parent id → child pages, for ?child_of= queries. */
export const childrenByParentId: Record<number, ServiceDetailPage[]> = {
  [servicesIndexPage.id]: serviceChildren,
};
