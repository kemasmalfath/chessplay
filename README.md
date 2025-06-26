# 🏆 Chess Game - Permainan Catur Online

Sebuah permainan catur interaktif yang dibuat dengan HTML, CSS, dan JavaScript murni. Game ini menampilkan papan catur yang berputar otomatis dan tema gelap yang elegan.

![Chess Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Play-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎮 Fitur Utama

### ✨ **Gameplay Features**
- 🏁 **Papan catur 8x8** dengan semua bidak di posisi awal yang benar
- ♔ **Semua jenis bidak** (Raja, Ratu, Benteng, Gajah, Kuda, Pion) dengan simbol Unicode
- 🔄 **Rotasi papan otomatis** - papan berputar saat berganti giliran
- 🎯 **Validasi gerakan** sesuai aturan catur untuk setiap jenis bidak
- 👥 **Turn-based gameplay** - bergantian antara putih dan hitam
- 🎪 **Visual feedback** dengan highlight untuk bidak terpilih dan gerakan valid
- 💀 **Sistem tangkap bidak** dengan display bidak yang tertangkap
- 🏆 **Deteksi kemenangan** ketika raja tertangkap

### 🎨 **Visual Features**
- 🌙 **Tema gelap dominan** dengan gradien yang elegan
- ✨ **Animasi smooth** untuk rotasi papan dan hover effects
- 📱 **Responsive design** - berfungsi di desktop dan mobile
- 🎭 **Efek visual menarik** dengan shadow, glow, dan scaling
- 🏅 **Judul dengan efek gradien emas**

## 🚀 Cara Menjalankan

### Metode 1: Download dan Buka Langsung
1. Download semua file (`index.html`, `styles.css`, `script.js`)
2. Buka file `index.html` di browser favorit Anda
3. Mulai bermain!

### Metode 2: Live Server (Recommended)
1. Buka folder project di VS Code
2. Install extension "Live Server"
3. Klik kanan pada `index.html` → "Open with Live Server"
4. Game akan terbuka di browser secara otomatis

## 🎯 Cara Bermain

### 🎮 **Kontrol Dasar**
1. **Pilih bidak** - Klik pada bidak yang ingin Anda gerakkan (hanya bidak warna Anda)
2. **Lihat gerakan valid** - Kotak biru = gerakan kosong, kotak merah = tangkap bidak lawan
3. **Pindahkan bidak** - Klik pada kotak tujuan yang di-highlight
4. **Berganti giliran** - Game otomatis beralih ke pemain lain
5. **Papan berputar** - Papan akan berputar agar bidak Anda selalu di bawah

### 🏁 **Aturan Kemenangan**
- Game berakhir ketika salah satu **Raja** berhasil ditangkap
- Pemenang akan ditampilkan di layar
- Klik **"New Game"** untuk memulai permainan baru

## 🔧 Struktur File

\`\`\`
chess-game/
│
├── index.html          # Struktur HTML utama
├── styles.css          # Styling dan tema gelap
├── script.js           # Logic permainan dan interaksi
└── README.md           # Dokumentasi ini
\`\`\`

## 🎨 Teknologi yang Digunakan

- **HTML5** - Struktur dasar dan semantic markup
- **CSS3** - Styling, animasi, dan responsive design
  - CSS Grid untuk layout papan catur
  - CSS Transitions untuk animasi smooth
  - Flexbox untuk layout responsif
- **JavaScript ES6+** - Game logic dan interaksi
  - Class-based architecture
  - Event handling
  - DOM manipulation

## 🎪 Fitur Visual Detail

### 🌈 **Color Scheme**
- **Background**: Gradien biru gelap ke ungu gelap
- **Container**: Gradien abu-abu gelap dengan border ungu
- **Papan**: Kotak gelap (coklat tua #3c2e26) dan terang (coklat muda #8b7355)
- **Accent**: Emas (#ffd700) untuk text penting
- **Highlights**: Hijau untuk selected, biru untuk valid moves, merah untuk captures

### 🎭 **Animasi**
- **Rotasi papan**: 0.8 detik smooth transition
- **Hover effects**: Scale dan opacity changes
- **Button interactions**: Transform dan shadow effects

## 📱 Responsive Design

Game ini fully responsive dan dapat dimainkan di:
- 🖥️ **Desktop** (1200px+)
- 💻 **Laptop** (768px - 1199px)
- 📱 **Tablet** (481px - 767px)
- 📱 **Mobile** (320px - 480px)

## 🔮 Fitur yang Bisa Ditambahkan

- [ ] **Deteksi Skak Mat** - Implementasi check dan checkmate detection
- [ ] **Castling** - Gerakan rokade raja dan benteng
- [ ] **En Passant** - Aturan tangkap pion khusus
- [ ] **Promosi Pion** - Upgrade pion yang mencapai ujung papan
- [ ] **History Gerakan** - Log semua gerakan yang telah dilakukan
- [ ] **Undo/Redo** - Batalkan atau ulangi gerakan
- [ ] **AI Opponent** - Lawan komputer dengan berbagai tingkat kesulitan
- [ ] **Timer** - Waktu bermain untuk setiap pemain
- [ ] **Sound Effects** - Efek suara untuk gerakan dan tangkapan
- [ ] **Save/Load Game** - Simpan dan muat permainan

## 🐛 Known Issues

- Belum ada deteksi skak mat (game hanya berakhir saat raja tertangkap)
- Belum ada implementasi castling dan en passant
- Pion belum bisa promosi saat mencapai ujung papan

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin menambahkan fitur atau memperbaiki bug:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

## 👨‍💻 Author

Dibuat dengan ❤️ menggunakan vanilla JavaScript, HTML, dan CSS.

---

**Selamat bermain catur! 🏆**

*Nikmati pengalaman bermain catur dengan papan yang berputar dan tema gelap yang elegan.*
