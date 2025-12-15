# 🌟 Asah Memory 2025

Selamat datang di **Asah Memory 2025** — sebuah platform web interaktif yang dirancang untuk mengabadikan momen kebersamaan dalam bentuk galeri digital yang hidup dan dinamis. Project ini dibangun dengan sentuhan estetika modern "playful doodle" yang hangat dan menyenangkan.

![Asah Memory Preview](public/image.png)

---

## 📋 Tentang Project

**Asah Memory** bukan sekadar galeri foto biasa. Website ini menghadirkan pengalaman visual yang unik di mana profil teman-teman tidak hanya diam, melainkan **mengorbit** mengelilingi pusat halaman layaknya tata surya.

Dibangun untuk komunitas, website ini mampu menampung dan menampilkan **50+ profil pengguna** secara bersamaan tanpa terasa padat, berkat algoritma **Multi-Ring Orbit** yang cerdas.

### ✨ Fitur Utama

*   **🌌 Sistem Orbit Dinamis**: Avatar pengguna bergerak mengelilingi layar dalam lintasan orbit yang presisi, menciptakan efek visual "hidup" yang memukau.
*   **🎨 Tema Playful & Estetik**: Desain antarmuka yang bersih dengan warna krem lembut dan aksen biru, dilengkapi hiasan animasi pesawat kertas dan bunga yang digambar tangan.
*   **🚀 Performa Tinggi (50+ User)**: Menggunakan algoritma distribusi cincin (multi-ring) untuk memastikan puluhan avatar dapat tampil rapi tanpa bertumpuk.
*   **⚡ Kompresi Gambar Otomatis**: Fitur cerdas yang otomatis mengecilkan ukuran file foto saat diunggah, menjaga performa website tetap ringan dan cepat.
*   **💫 Animasi Halus**: Ditenagai oleh **Framer Motion** untuk setiap transisi, efek hover, dan pergerakan elemen yang sangat mulus.

---

## 🛠️ Teknologi yang Digunakan

Project ini dikembangkan menggunakan stack teknologi modern untuk menjamin performa dan pengalaman pengembang (DX) terbaik:

*   **[React.js 19](https://react.dev/)**: Library UI utama untuk membangun komponen interaktif.
*   **[Vite](https://vitejs.dev/)**: Build tool generasi terbaru yang super cepat.
*   **[Framer Motion](https://www.framer.com/motion/)**: Library animasi standar industri untuk React.
*   **CSS3 Modern**: Styling responsif dengan Glassmorphism effect.

---

## 🚀 Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 16 atau terbaru).

### Langkah-langkah

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/asahamemory.git
    cd asahamemory
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Jalankan Mode Pengembangan**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:5173` di browser Anda.

4.  **Build untuk Produksi**
    ```bash
    npm run build
    npm run preview
    ```

---

## 📂 Struktur Project

```text
src/
├── components/
│   ├── FloatingAvatar.jsx       # Komponen avatar dengan animasi orbit
│   ├── ProfileControls.jsx      # Form input data pengguna (Tengah)
│   └── BackgroundDecorations.jsx # Hiasan latar belakang (Pesawat, Bunga)
├── App.jsx                      # Logika utama (State profil, Orbit, Kompresi)
├── App.css                      # Styling global
└── main.jsx                     # Entry point aplikasi
```

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda memiliki ide fitur baru atau perbaikan:

1.  Fork repository ini.
2.  Buat branch fitur baru (`git checkout -b fitur-keren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Push ke branch tersebut (`git push origin fitur-keren`).
5.  Buat Pull Request.

---

## 📝 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).

---

Dibuat dengan ❤️ untuk **Teman-teman Asah**.
