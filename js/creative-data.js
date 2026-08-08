/* ==========================================================================
   CREATIVE PORTFOLIO DATA — showcase.html only
   Rendered into a 4-column grid with "Load More" pagination (4 tiles per
   reveal). Each tile opens a slideshow (images) or video-set (isVideoSet)
   in the gallery modal.
   ========================================================================== */

const CREATIVE_DATA_SC = [
  {
    id: "c01",
    title: "Secangkir Ilmu — Promotion Posters",
    tag: "Poster",
    thumb: "assets/graphic-design-web/06-promo1.jpg",
    slides: [
      "assets/graphic-design-web/06-promo1.jpg",
      "assets/graphic-design-web/07-promo2.jpg",
      "assets/graphic-design-web/08-promo3.jpg",
      "assets/graphic-design-web/09-promo4.jpg",
      "assets/graphic-design-web/10-promo5.jpg",
      "assets/graphic-design-web/11-promo6.jpg"
    ],
    slideLabels: ["Poster 1", "Poster 2", "Poster 3", "Poster 4", "Poster 5", "Poster 6"]
  },
  {
    id: "c02",
    title: "Logo Explorations",
    tag: "Logo",
    thumb: "assets/graphic-design-web/04-logo1.jpg",
    slides: [
      "assets/graphic-design-web/04-logo1.jpg",
      "assets/graphic-design-web/05-logo2.jpg",
      "assets/thumbs/08-logo-designkan.jpg",
      "assets/thumbs/09-logo-skylearn.jpg"
    ],
    slideLabels: ["Logo Concept 1", "Logo Concept 2", "DesignKan (Animated)", "Skylearn (Animated)"]
  },
  {
    id: "c03",
    title: "Radio & Event Poster",
    tag: "Poster",
    thumb: "assets/graphic-design-web/12-radio-poster.jpg",
    slides: [
      "assets/graphic-design-web/12-radio-poster.jpg",
      "assets/graphic-design-web/01-sunsea.jpg",
      "assets/graphic-design-web/02-learn.jpg",
      "assets/graphic-design-web/03-chill.jpg"
    ],
    slideLabels: ["Radio Poster", "Sunsea", "Learn", "Chill"]
  },
  {
    id: "c04",
    title: "Instagram Feed — \"Jalan Jalan\" Series",
    tag: "Social Media",
    thumb: "assets/feeds-ig-web/folder1/01-cover.jpg",
    slides: [
      "assets/feeds-ig-web/folder1/01-cover.jpg",
      "assets/feeds-ig-web/folder1/02-isi1.jpg",
      "assets/feeds-ig-web/folder1/03-isi2.jpg",
      "assets/feeds-ig-web/folder1/04-isi3.jpg",
      "assets/feeds-ig-web/folder1/05-isi4.jpg",
      "assets/feeds-ig-web/folder1/06-closing.jpg"
    ],
    slideLabels: ["Cover", "Broadway", "Galeri Indonesia Kaya", "Petak Sembilan", "Ashta District 8", "Closing"]
  },
  {
    id: "c05",
    title: "BPM FIP UNJ — Organizational Decks",
    tag: "Presentation",
    thumb: "assets/ppt-thumbs/01-sekilas-bpm-1.jpg",
    slides: [
      "assets/ppt-thumbs/01-sekilas-bpm-1.jpg",
      "assets/ppt-thumbs/03-badan-kaderisasi-1.jpg",
      "assets/ppt-thumbs/04-badan-legislasi-1.jpg",
      "assets/ppt-thumbs/06-komisi-psdm-1.jpg",
      "assets/ppt-thumbs/07-komisi-pendidikan-1.jpg",
      "assets/ppt-thumbs/08-komisi-advokasi-1.jpg",
      "assets/ppt-thumbs/09-komisi-kominfo-1.jpg",
      "assets/ppt-thumbs/10-komisi-sospol-1.jpg"
    ],
    slideLabels: ["Sekilas BPM", "Badan Kaderisasi", "Badan Legislasi", "Komisi PSDM", "Komisi Pendidikan", "Komisi Advokasi", "Komisi Kominfo", "Komisi Sospol"]
  },
  {
    id: "c06",
    title: "Motion Graphic Reel",
    tag: "Motion",
    thumb: "assets/thumbs/06-fire-fire.jpg",
    isVideoSet: true,
    slides: [
      "assets/video/06-fire-fire.mp4",
      "assets/video/07-kinetic-typography-teaser.mp4",
      "assets/video/04-bumper-secangkir-ilmu-1.mp4",
      "assets/video/05-bumper-secangkir-ilmu-2.mp4"
    ],
    slideLabels: ["Fire Fire — Motion Study", "Kinetic Typography Teaser", "Bumper v1", "Bumper v2"]
  },
  {
    id: "c07",
    title: "Explainer Video Series",
    tag: "Motion",
    thumb: "assets/thumbs/16-simple-video-arvr.jpg",
    isVideoSet: true,
    slides: [
      "assets/video/16-simple-video-arvr.mp4",
      "assets/video/15-simple-video-android.mp4",
      "assets/video/17-simple-video-desain-grafis.mp4",
      "assets/video/18-simple-video-web-programming.mp4"
    ],
    slideLabels: ["AR/VR Explainer", "Android Explainer", "Graphic Design Explainer", "Web Programming Explainer"]
  },
  {
    id: "c08",
    title: "Social Loop & Cover Animation",
    tag: "Social Media",
    thumb: "assets/thumbs/02-snack-content-cover-loop.jpg",
    isVideoSet: true,
    slides: [
      "assets/video/02-snack-content-cover-loop.mp4",
      "assets/video/01-poster-jobfair-feeds.mp4",
      "assets/video/03-poster-jobfair-igstory.mp4"
    ],
    slideLabels: ["Snack Content Loop", "Jobfair — Feed Animation", "Jobfair — IG Story Animation"]
  },
  {
    id: "c09",
    title: "Presentation Video Series",
    tag: "Motion",
    thumb: "assets/thumbs/10-presentation-manajemen-sistem-informasi.jpg",
    isVideoSet: true,
    slides: [
      "assets/video/10-presentation-manajemen-sistem-informasi.mp4",
      "assets/video/11-presentation-visualisasi-konsep.mp4",
      "assets/video/12-presentation-lms-dokeos.mp4"
    ],
    slideLabels: ["Materi Manajemen Sistem Informasi", "Visualisasi Konsep yang Lebih Luas", "LMS Dokeos"]
  },
  {
    id: "c10",
    title: "Promotion Video & Reels",
    tag: "Motion",
    thumb: "assets/thumbs/13-promotion-secangkir-ilmu.jpg",
    isVideoSet: true,
    slides: [
      "assets/video/13-promotion-secangkir-ilmu.mp4",
      "assets/video/14-reels-cooking-baking.mp4"
    ],
    slideLabels: ["Promotion Video — Secangkir Ilmu", "Reels — Cooking & Baking"]
  },
  {
    id: "c11",
    title: "Instagram Feed — FYI Week 1",
    tag: "Social Media",
    thumb: "assets/secangkir-ilmu-web/fyi1/00-cover.jpg",
    slides: [
      "assets/secangkir-ilmu-web/fyi1/00-cover.jpg",
      "assets/secangkir-ilmu-web/fyi1/01-isi.jpg",
      "assets/secangkir-ilmu-web/fyi1/02-isi.jpg",
      "assets/secangkir-ilmu-web/fyi1/03-isi.jpg",
      "assets/secangkir-ilmu-web/fyi1/04-isi.jpg",
      "assets/secangkir-ilmu-web/fyi1/05-isi.jpg",
      "assets/secangkir-ilmu-web/fyi1/06-isi.jpg"
    ],
    slideLabels: ["Cover", "Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5", "Tip 6"]
  },
  {
    id: "c12",
    title: "Instagram Feed — FYI Android Edition",
    tag: "Social Media",
    thumb: "assets/secangkir-ilmu-web/fyi2/00-cover.jpg",
    slides: [
      "assets/secangkir-ilmu-web/fyi2/00-cover.jpg",
      "assets/secangkir-ilmu-web/fyi2/01-bridging.jpg",
      "assets/secangkir-ilmu-web/fyi2/02-isi1.jpg",
      "assets/secangkir-ilmu-web/fyi2/03-isi2.jpg",
      "assets/secangkir-ilmu-web/fyi2/04-isi3.jpg",
      "assets/secangkir-ilmu-web/fyi2/05-isi4.jpg",
      "assets/secangkir-ilmu-web/fyi2/06-isi5.jpg",
      "assets/secangkir-ilmu-web/fyi2/07-closing.jpg"
    ],
    slideLabels: ["Cover", "Bridging", "Isi 1", "Isi 2", "Isi 3", "Isi 4", "Isi 5", "Closing"]
  },
  {
    id: "c13",
    title: "Instagram Feed — FYI Week 6",
    tag: "Social Media",
    thumb: "assets/secangkir-ilmu-web/fyi3/00-cover.jpg",
    slides: [
      "assets/secangkir-ilmu-web/fyi3/00-cover.jpg",
      "assets/secangkir-ilmu-web/fyi3/01-prolog.jpg",
      "assets/secangkir-ilmu-web/fyi3/02-isi1.jpg",
      "assets/secangkir-ilmu-web/fyi3/03-isi2.jpg",
      "assets/secangkir-ilmu-web/fyi3/04-isi3.jpg",
      "assets/secangkir-ilmu-web/fyi3/05-epilog.jpg"
    ],
    slideLabels: ["Cover", "Prolog", "Isi 1", "Isi 2", "Isi 3", "Epilog"]
  },
  {
    id: "c14",
    title: "Instagram Feed — Open Recruitment",
    tag: "Social Media",
    thumb: "assets/secangkir-ilmu-web/oprec/00-cover.jpg",
    slides: [
      "assets/secangkir-ilmu-web/oprec/00-cover.jpg",
      "assets/secangkir-ilmu-web/oprec/01-bridging.jpg",
      "assets/secangkir-ilmu-web/oprec/02-isi-tekno.jpg",
      "assets/secangkir-ilmu-web/oprec/03-isi-adm.jpg",
      "assets/secangkir-ilmu-web/oprec/04-closing.jpg"
    ],
    slideLabels: ["Cover", "Bridging", "Divisi Tekno", "Divisi Admin", "Closing"]
  },
  {
    id: "c15",
    title: "Instagram Feed — This or That",
    tag: "Social Media",
    thumb: "assets/secangkir-ilmu-web/thisorthat/00-cover.jpg",
    isVideoSet: true,
    slides: [
      "assets/secangkir-ilmu-web/thisorthat/video.mp4"
    ],
    slideLabels: ["This or That — Week 4"]
  }
];
