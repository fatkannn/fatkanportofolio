/* ==========================================================================
   PORTFOLIO DATA
   ========================================================================== */

const SKILLS_DATA = [
  { name: "E-Learning Dev", icon: "graduation-cap" },
  { name: "Articulate Storyline", icon: "layers" },
  { name: "Adobe After Effects", icon: "film" },
  { name: "Premiere Pro", icon: "video" },
  { name: "Illustrator", icon: "pen-tool" },
  { name: "Adobe Animate", icon: "sparkles" },
  { name: "Moodle LMS", icon: "server" },
  { name: "WordPress", icon: "globe" },
  { name: "H5P", icon: "puzzle" },
  { name: "Figma", icon: "figma" },
  { name: "UI/UX Design", icon: "layout-panel-left" },
  { name: "Motion Graphics", icon: "clapperboard" }
];

/* ==========================================================================
   FEATURED PROJECTS
   Ordered by credibility, not by media type. No category labels —
   client name + project type is the framing (e.g. "Boga Group — Corporate
   Learning"), matching a Digital Learning Developer identity rather than
   a generalist designer identity.

   type: "interactive" -> embedSrc (iframe) or externalUrl (new tab)
         "video"       -> src (local mp4), opens in video lightbox
         "gallery"     -> slides[] array, opens in slide viewer
         "showcase"    -> no interactive asset available yet; thumb only,
                          opens a simple detail view (branded placeholder +
                          description). Used for real client work (Boga
                          Group, LRT Jakarta) where files aren't in hand yet.
   ========================================================================== */

const FEATURED_DATA = [
  { id: "f01", client: "Boga Group", logo: "assets/client-logos-v2/logo-boga-group.png", href: "showcase.html#sc-boga" },
  { id: "f02", client: "Lookmedia", logo: "assets/client-logos-v2/logo-lookmedia.png", href: "showcase.html#sc-lookmedia" },
  { id: "f03", client: "Arkademi", logo: "assets/client-logos-v2/logo-arkademi.png", href: "showcase.html#sc-arkademi" },
  { id: "f04", client: "Cariilmu", logo: "assets/client-logos-v2/logo-cariilmu.png", href: "showcase.html#sc-cariilmu" },
  { id: "f05", client: "ICE Institute", logo: "assets/client-logos-v2/logo-ice-institute.png", href: "showcase.html#sc-ice" },
  { id: "f06", client: "Kemendikdasmen", logo: "assets/client-logos-v2/logo-kemendikdasmen.png", href: "showcase.html#sc-kemendikdasmen" },
  { id: "f07", client: "LRT Jakarta", logo: "assets/client-logos-v2/logo-lrt-jakarta.png", href: "showcase.html#sc-lrt" },
  { id: "f08", client: "Personal Client Project", logo: "assets/client-logos-v2/logo-personal-client.png", href: "showcase.html#sc-academic-thesis" }
];

/* Secondary interactive modules — not on the main Featured grid, but
   referenced from Kemendikdasmen / thesis entries where relevant. */
const INTERACTIVE_EXTRA = [
  {
    id: "ix01",
    title: "Menjaga Disintegrasi Indonesia",
    desc: "Non-linear Storyline module on national unity for high school social studies, packaged as an Android APK.",
    embedSrc: "https://fatkannn.github.io/MenjagaDisintegrasi/story_html5.html"
  },
  {
    id: "ix02",
    title: "Argumentative Essay — Hypermedia",
    desc: "Hypermedia English course module for Universitas YARSI, built from a non-linear flowchart design.",
    embedSrc: "https://fatkannn.github.io/AgumenEssay/story_html5.html"
  }
];


const EXPERIENCE_DATA = [
  {
    org: "Boga Group",
    initials: "BG",
    role: "Training and Development Contract",
    date: "Jun 2026 – Present",
    desc: "Running Training Needs Analysis across 12 Boga Group brands, producing 34+ short-form training videos, and piloting a 360°-photo VR learning prototype."
  },
  {
    org: "Lookmedia",
    initials: "LM",
    role: "E-Learning Developer",
    date: "Dec 2025 – May 2026",
    desc: "Built Learning Objects and interactive modules for UNDP, UNFPA, Kemenhut, Bank BCA, Kemenkes, Garuda Food, and KPK. Led development of Learnova, a WordPress-based MOOC platform."
  },
  {
    org: "Arkademi",
    initials: "AK",
    role: "Learning Video Editor",
    date: "Aug 2023 – Aug 2024",
    desc: "Edited long-form learning videos and supervised two freelance editors, from briefing through final quality control."
  },
  {
    org: "IBJ Group",
    initials: "IBJ",
    role: "Learning Video Editor",
    date: "Sep 2021 – Mar 2022",
    desc: "Edited raw production footage into learning video, maintaining consistent visual and audio presets across the library."
  }
];
