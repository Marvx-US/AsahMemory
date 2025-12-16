# 🌟 Asah Memory 2025

Selamat datang di **Asah Memory 2025** — sebuah platform web interaktif yang dirancang untuk mengabadikan momen kebersamaan dalam bentuk galeri digital yang hidup dan dinamis. Project ini dibangun dengan sentuhan estetika modern "Glassmorphism" yang elegan.

![Asah Memory Preview](https://via.placeholder.com/800x400?text=Asah+Memory+Preview)

---

## 📋 Tentang Project

**Asah Memory** menghadirkan pengalaman visual yang unik di mana profil teman-teman tidak hanya diam, melainkan **mengorbit** mengelilingi pusat halaman layaknya tata surya. Anda dapat mengunggah foto, dan foto tersebut akan terlihat oleh semua pengguna lain di jaringan lokal Anda.

### ✨ Fitur Utama

*   **🌌 Multiplayer Lokal**: Avatar yang Anda tambahkan disimpan di server dan dapat dilihat oleh teman yang terhubung ke jaringan Wi-Fi yang sama.
*   **🖱️ Interaktif**: Klik avatar teman untuk melihat kartu identitas "Pop-up" dengan detail lengkap.
*   **🎨 Glassmorphism UI**: Desain antarmuka transparan yang modern, konsisten dari form hingga popup modal.
*   **⭕ Perfect Circle**: Avatar didesain bulat sempurna dengan rasio aspek terkunci.
*   **� Performa Tinggi**: Menangani 50+ avatar bergerak sekaligus tanpa lag menggunakan Framer Motion.

---

## 🛠️ Teknologi yang Digunakan

**Frontend (Client)**
*   **[React.js 19](https://react.dev/)**: Library UI utama.
*   **[Vite](https://vitejs.dev/)**: Build tool super cepat.
*   **[Framer Motion](https://www.framer.com/motion/)**: Animasi orbit dan transisi halus.

**Backend (Server)**
*   **[Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)**: Server API RESTful ringan.
*   **Local Storage**: Data disimpan dalam file JSON (Zero-config database).

---

## 🚀 Instalasi & Menjalankan Project

Project ini terdiri dari dua bagian: **Frontend** dan **Backend**. Anda perlu menjalankan keduanya.

### Prasyarat
*   [Node.js](https://nodejs.org/) (versi 16 atau terbaru).

### Langkah 1: Jalankan Backend (Server)
Buka terminal baru dan jalankan:

```bash
cd backend
npm install   # (Hanya pertama kali)
npm start
```
_Output: Server running on http://localhost:3001_

### Langkah 2: Jalankan Frontend (Aplikasi)
Buka **terminal kedua** (terminal baru) dan jalankan:

```bash
cd frontend
npm install   # (Hanya pertama kali)
npm run dev
```
_Buka link yang muncul (biasanya [http://localhost:5173](http://localhost:5173)) di browser._

### Langkah 3: Akses dari HP / Komputer Lain
Untuk melihat fitur multiplayer:
1.  Pastikan HP/Laptop lain terhubung ke **Wi-Fi yang sama**.
2.  Cari IP Address komputer Anda (misal `192.168.1.15`).
3.  Buka `http://192.168.1.15:5173` di HP.

---

## 🏭 Mode Produksi (Satu Perintah)

Untuk menjalankan aplikasi dalam mode produksi (lebih cepat dan stabil), Anda dapat menjalankannya langsung dari folder utama (root) tanpa perlu membuka dua terminal.

### 1. Instalasi Semua Dependensi
Jalankan perintah ini sekali saja di awal:
```bash
npm run install-all
```

### 2. Jalankan Aplikasi
Gunakan perintah ini untuk mem-build frontend dan menjalankan server sekaligus:
```bash
npm run prod
```
Aplikasi akan berjalan di `http://localhost:3001` (atau port yang Anda tentukan).
Untuk development dengan dua terminal dalam satu perintah, gunakan:
```bash
npm run dev
```

---

## 📂 Struktur Folder Baru

```text
/
├── backend/               # Server Side
│   ├── server.js          # Kode server Express
│   ├── server_profiles.json # Database lokal (Jangan dicommit)
│   └── .env.example       # Template environment variables
├── frontend/              # Client Side
│   ├── src/               # Source code React
│   │   ├── components/    # FloatingAvatar, ProfileControls, dll
│   │   └── App.jsx        # Halaman utama
│   └── package.json
└── README.md
```

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Silakan fork repository ini dan buat Pull Request.

---

## 📝 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).

---

Dibuat dengan ❤️ untuk **Teman-teman Asah**.
