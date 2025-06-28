# 🏆 Advanced Chess Game - Permainan Catur Modern

Sebuah permainan catur interaktif yang dibuat dengan HTML, CSS, dan JavaScript murni. Game ini menampilkan papan catur dengan warna yang jelas, AI opponent, dan fully responsive untuk semua perangkat.

![Chess Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Play-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-green)

## 🎮 Fitur Utama

### ✨ **Gameplay Features**
- 🏁 **Papan catur 8x8** dengan semua bidak di posisi awal yang benar
- ♔ **Semua jenis bidak** (Raja, Ratu, Benteng, Gajah, Kuda, Pion) dengan simbol Unicode yang jelas
- 🎯 **Validasi gerakan** sesuai aturan catur untuk setiap jenis bidak
- 👥 **Turn-based gameplay** - bergantian antara putih dan hitam
- 🎪 **Visual feedback** dengan highlight untuk bidak terpilih dan gerakan valid
- 💀 **Sistem tangkap bidak** dengan display bidak yang tertangkap
- 🏆 **Deteksi kemenangan** dengan checkmate dan stalemate detection

### 🎨 **Visual Features**
- 🌙 **Tema gelap dominan** dengan gradien yang elegan
- ♟️ **Warna papan tradisional** - kotak putih krem (#f0d9b5) dan coklat (#b58863)
- 📱 **Fully responsive design** - optimal di desktop, tablet, dan mobile
- 🎭 **Efek visual menarik** dengan shadow, glow, dan scaling
- 🏅 **Judul dengan efek gradien emas**
- 🔄 **Papan statis** - tidak berputar, posisi konsisten

### 🤖 **AI Features**
- 🎯 **3 tingkat kesulitan** (Easy, Medium, Hard)
- 🧠 **Smart AI** yang memprioritaskan capture dan kontrol center
- ⚡ **Response time** yang dapat disesuaikan
- 🔄 **Toggle AI** on/off kapan saja

### ⏱️ **Timer & History**
- ⏰ **Timer system** dengan pilihan waktu (10, 15, 30 menit, atau tanpa timer)
- 📝 **Move history** dengan notasi catur standar
- ↩️ **Undo/Redo** gerakan dengan unlimited steps
- 💾 **Save/Load game** ke file JSON

### 🔊 **Audio Features**
- 🎵 **Sound effects** untuk gerakan, capture, check, dan checkmate
- 🔇 **Toggle sound** on/off
- 🎼 **Web Audio API** untuk suara yang crisp

## 🚀 Cara Menjalankan

### Metode 1: Download dan Buka Langsung
1. Download semua file dari repository
2. Buka file `index.html` di browser favorit Anda
3. Mulai bermain!

### Metode 2: Live Server (Recommended untuk Development)
1. Buka folder project di VS Code
2. Install extension "Live Server"
3. Klik kanan pada `index.html` → "Open with Live Server"
4. Game akan terbuka di browser secara otomatis

### Metode 3: Web Server
\`\`\`bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js
npx http-server

# Akses di browser: http://localhost:8000
\`\`\`

## 📱 Mobile Support

Game ini **fully responsive** dan dioptimalkan untuk semua perangkat:

### 📱 **Mobile Features:**
- **Touch-friendly** - tap untuk memilih dan memindahkan bidak
- **Responsive layout** - UI menyesuaikan ukuran layar
- **Simplified controls** - panel samping disembunyikan di mobile
- **Optimized font size** - bidak dan text tetap jelas di layar kecil
- **Portrait & landscape** - mendukung orientasi portrait dan landscape

### 📐 **Breakpoints:**
- **Desktop** (1200px+): Full layout dengan panel samping
- **Laptop** (768px - 1199px): Layout sedang
- **Tablet** (481px - 767px): Layout compact
- **Mobile** (320px - 480px): Layout minimal, fokus pada papan

## 🎯 Cara Bermain

### 🎮 **Kontrol Dasar**
1. **Pilih bidak** - Klik/tap pada bidak yang ingin Anda gerakkan
2. **Lihat gerakan valid** - Kotak biru = gerakan kosong, kotak merah = tangkap bidak lawan
3. **Pindahkan bidak** - Klik/tap pada kotak tujuan yang di-highlight
4. **Berganti giliran** - Game otomatis beralih ke pemain lain

### 🏁 **Aturan Kemenangan**
- **Checkmate** - Raja tidak bisa bergerak dan dalam ancaman
- **Stalemate** - Tidak ada gerakan legal tersisa (seri)
- **Time out** - Waktu habis (jika timer diaktifkan)

### 🎯 **Fitur Khusus**
- **Castling** - Gerakan rokade raja dan benteng
- **En Passant** - Tangkap pion secara khusus
- **Pawn Promotion** - Upgrade pion yang mencapai ujung papan
- **Check Detection** - Deteksi skak otomatis

## 🔧 Struktur File

\`\`\`
chess-game/
│
├── index.html              # Struktur HTML utama
├── styles.css              # Styling dan responsive design
├── js/
│   ├── utils.js            # Utility functions
│   ├── sound-manager.js    # Audio management
│   ├── board-manager.js    # Board display & management
│   ├── move-validator.js   # Move validation logic
│   ├── game-logic.js       # Core game logic
│   ├── ai-engine.js        # AI opponent
│   ├── timer-manager.js    # Timer functionality
│   ├── history-manager.js  # Move history & undo/redo
│   ├── save-load-manager.js# Save/load games
│   ├── ui-manager.js       # UI management
│   └── main.js             # Main game orchestrator
└── README.md               # Dokumentasi ini
\`\`\`

## 🎨 Teknologi yang Digunakan

- **HTML5** - Semantic markup dan struktur
- **CSS3** - Advanced styling dan responsive design
  - CSS Grid untuk layout papan catur
  - Flexbox untuk layout responsif
  - Media queries untuk mobile optimization
  - CSS animations untuk efek visual
- **JavaScript ES6+** - Modern JavaScript features
  - Class-based architecture
  - Modular design pattern
  - Event handling
  - Web Audio API
  - Local Storage API

## 🎪 Fitur Visual Detail

### 🌈 **Color Scheme**
- **Background**: Gradien biru gelap ke ungu gelap
- **Container**: Gradien abu-abu gelap dengan border ungu
- **Papan**: Kotak terang (#f0d9b5) dan gelap (#b58863) - warna tradisional catur
- **Accent**: Emas (#ffd700) untuk text penting
- **Highlights**: Hijau untuk selected, biru untuk valid moves, merah untuk captures

### 🎭 **Responsive Design**
- **Desktop**: Layout 3-kolom dengan panel samping
- **Tablet**: Layout 2-kolom yang compact
- **Mobile**: Layout 1-kolom, fokus pada papan catur

## 📱 Mobile Optimization

### 🎯 **Touch Interface**
- **Large touch targets** - mudah di-tap dengan jari
- **Visual feedback** - highlight yang jelas saat tap
- **Gesture support** - tap untuk select dan move

### 📐 **Layout Adaptations**
- **Simplified UI** - panel samping disembunyikan di mobile
- **Larger buttons** - kontrol yang mudah diakses
- **Optimized spacing** - jarak yang nyaman untuk touch

### ⚡ **Performance**
- **Lightweight** - loading cepat di koneksi mobile
- **Smooth animations** - 60fps di semua perangkat
- **Battery efficient** - optimized untuk mobile battery

## 🔮 Fitur Lanjutan

### ✅ **Sudah Tersedia**
- ✅ **Deteksi Checkmate & Stalemate**
- ✅ **Castling** - Gerakan rokade
- ✅ **En Passant** - Tangkap pion khusus
- ✅ **Pawn Promotion** - Upgrade pion
- ✅ **Move History** - Log semua gerakan
- ✅ **Undo/Redo** - Batalkan atau ulangi gerakan
- ✅ **AI Opponent** - 3 tingkat kesulitan
- ✅ **Timer System** - Waktu bermain
- ✅ **Sound Effects** - Efek suara
- ✅ **Save/Load** - Simpan dan muat permainan

### 🔮 **Roadmap Future Features**
- [ ] **Opening Book** - Database pembukaan catur
- [ ] **Puzzle Mode** - Mode latihan taktik
- [ ] **Online Multiplayer** - Bermain online
- [ ] **Game Analysis** - Analisis permainan
- [ ] **Multiple Themes** - Tema papan yang berbeda
- [ ] **PGN Export/Import** - Format standar catur
- [ ] **Tournament Mode** - Mode turnamen
- [ ] **Rating System** - Sistem rating ELO

## 🎮 Controls & Shortcuts

### 🖱️ **Desktop Controls**
- **Click** - Select piece / Make move
- **Hover** - Preview piece movement
- **Keyboard shortcuts** (planned)

### 📱 **Mobile Controls**
- **Tap** - Select piece / Make move
- **Long press** - Show piece info (planned)
- **Swipe** - Navigate history (planned)

## 🐛 Known Issues & Limitations

### ⚠️ **Current Limitations**
- Tidak ada deteksi draw by repetition
- Tidak ada 50-move rule
- AI belum menggunakan opening book
- Belum ada mode spectator

### 🔧 **Browser Compatibility**
- **Chrome** ✅ (Recommended)
- **Firefox** ✅
- **Safari** ✅
- **Edge** ✅
- **Mobile browsers** ✅

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin menambahkan fitur atau memperbaiki bug:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### 🎯 **Areas for Contribution**
- UI/UX improvements
- AI engine enhancement
- Mobile optimization
- New game modes
- Performance optimization
- Accessibility features

## 📄 Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

## 🙏 Acknowledgments

- Chess piece Unicode symbols
- Web Audio API documentation
- CSS Grid and Flexbox guides
- Modern JavaScript best practices

## 👨‍💻 Author

Dibuat dengan ❤️ menggunakan vanilla JavaScript, HTML, dan CSS.

**Tech Stack:**
- Frontend: HTML5, CSS3, JavaScript ES6+
- Architecture: Modular class-based design
- Responsive: Mobile-first approach
- Audio: Web Audio API
- Storage: Local Storage API

---

## 🎯 Quick Start Guide

### 🚀 **Untuk Pemain Baru:**
1. Buka `index.html` di browser
2. Klik bidak putih untuk memulai
3. Klik kotak tujuan untuk bergerak
4. Nikmati permainan!

### 🤖 **Untuk Bermain vs AI:**
1. Klik tombol "vs AI"
2. Pilih tingkat kesulitan
3. Anda bermain sebagai putih, AI sebagai hitam

### 📱 **Untuk Mobile:**
1. Buka di browser mobile
2. Tap bidak untuk memilih
3. Tap kotak tujuan untuk bergerak
4. UI otomatis menyesuaikan layar

**Selamat bermain catur! 🏆**

*Nikmati pengalaman bermain catur modern dengan AI yang cerdas dan tampilan yang responsif di semua perangkat.*
