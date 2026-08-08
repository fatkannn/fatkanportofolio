# Persepsi dan Desain Pesan — Course Page

Halaman satu-scroll-panjang yang merekonstruksi materi kuliah "Persepsi dan
Desain Pesan" dari backup Moodle (`.mbz`), dengan slideshow dan kuis
interaktif dibangun ulang sebagai komponen web native — bukan embed Moodle/
H5P asli.

## Struktur

```
index.html                → halaman utama, semua section di-render dari data
css/style.css                → semua styling (design tokens di bagian atas)
js/course-data.js               → EDIT DI SINI kalau perlu ubah teks/konten
js/img-lookup.js                   → mapping nama file gambar ke ekstensi asli
js/render.js                          → logic render, slideshow, kuis, lightbox
assets/images-web/                       → gambar banner/ilustrasi (terkompresi)
assets/h5p-images-web/                      → gambar slide materi (terkompresi)
```

## Bagaimana ini dibangun

Data diekstrak dari file backup Moodle 2.x (`.mbz`, sebenarnya tar.gz):
- `course/course.xml` dan `sections/*/section.xml` → struktur 8 section
- `activities/label_*/label.xml` → teks & gambar tiap slide
- `activities/hvp_*/hvp.xml` → 16 modul H5P, termasuk `json_content` lengkap
  (pertanyaan kuis, path gambar slideshow) yang tersimpan langsung di backup
- `files.xml` + `files/` → asset gambar asli, di-mapping dari content-hash
  ke nama file aslinya

Dua tipe H5P direkonstruksi sebagai komponen native:
- **`H5P.ImageSlider`** (11 modul, 91 slide total) → `.slideshow` component,
  navigasi klik/dot, gambar lazy-load
- **`H5P.SingleChoiceSet`** (5 modul, 36 pertanyaan) → `.quiz-card` component,
  jawaban dapat diklik, feedback benar/salah, skor akhir, tombol ulangi

## Kalau mau menambah/mengubah konten

Semua konten ada di `js/course-data.js` sebagai array `COURSE_DATA`. Setiap
section punya `activities[]`, tiap activity punya `type` (`label`, `hvp`,
atau `resource`). Untuk slideshow, edit `parsed_slides[]` (butuh `filename`
yang ada di `assets/h5p-images-web/`). Untuk kuis, edit `parsed_questions[]`
— **jawaban pertama di array `answers` selalu dianggap benar** (konvensi asli
H5P.SingleChoiceSet, dipertahankan di sini).

## Diketahui belum sempurna

- Beberapa link video non-YouTube (disebut sebagai "Klik Di sini" di teks
  asli) tidak ter-embed otomatis, tetap tampil sebagai link biasa — video
  YouTube sudah ter-embed penuh (7 video).
- 2 dokumen (`resource`) muncul sebagai kartu tapi belum bisa diunduh
  (originalnya file di Moodle, belum di-extract ke sini) — kartunya statis,
  linknya nonaktif (`onclick="return false"`).
- Beberapa teks sumber asli punya pengulangan kata yang terlihat seperti
  typo (misal "persepsi persepsi persepsi") — ini disalin apa adanya dari
  konten asli, bukan kesalahan proses ekstraksi.

## Menjalankan secara lokal

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Deploy gratis (GitHub Pages)

1. Buat repo baru di GitHub.
2. Upload semua isi folder ini ke root repo.
3. Settings → Pages → Branch `main`, folder `/ (root)` → Save.
4. Live dalam 1-2 menit di `https://<username>.github.io/<repo>/`.
