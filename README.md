<img width="732" height="477" alt="image" src="https://github.com/user-attachments/assets/9ab8cfd1-75b2-49ca-aba7-08daac3ebd99" />

# Aplikasi Transkripsi Masa Nyata dengan Gemini

Ini adalah aplikasi web yang menukarkan pertuturan kepada teks dalam masa nyata menggunakan Google Gemini Live API. Ia direka untuk memberikan transkripsi yang pantas dan tepat terus dari pelayar web anda.

## Ciri-ciri Utama

- **Transkripsi Masa Nyata**: Dengar audio dari mikrofon dan paparkan teks yang ditranskripsi serta-merta.
- **Visualisasi Audio**: Penunjuk visual menunjukkan bahawa aplikasi sedang aktif mendengar dan menangkap bunyi.
- **Sejarah Transkripsi**: Semua segmen transkripsi disimpan dengan cap masa (timestamp) untuk rujukan.
- **Pilihan Eksport**:
    - **Salin ke Papan Keratan**: Salin keseluruhan transkripsi dengan mudah.
    - **Simpan sebagai Fail**: Eksport transkripsi sebagai fail `.md` (Markdown) atau `.txt` (teks biasa).
- **Simpan & Pulih Sesi**: Transkripsi disimpan secara automatik dan boleh dipulihkan jika halaman dimuat semula secara tidak sengaja.
- **Pengendalian Ralat**: Memberi maklum balas yang jelas kepada pengguna sekiranya berlaku masalah seperti ralat rangkaian atau isu kebenaran mikrofon.
- **Antaramuka Responsif**: Direka untuk berfungsi dengan baik pada peranti desktop dan mudah alih.

## Bagaimana Ia Berfungsi

Aplikasi ini dibina menggunakan teknologi web moden untuk menyampaikan pengalaman yang lancar:

1.  **Antaramuka Pengguna (Frontend)**: Dibina dengan **React**, aplikasi ini menguruskan state dan interaksi pengguna secara cekap.
2.  **Penangkapan Audio**: **Web Audio API** digunakan untuk menangkap audio daripada mikrofon pengguna. Audio ini diproses dalam ketulan kecil (chunks) dan dikodkan ke format **PCM 16-bit**, yang sesuai untuk penstriman.
3.  **Enjin Transkripsi**: **Google Gemini Live API** (`gemini-2.5-flash-native-audio-preview-09-2025`) menerima strim audio PCM dan melakukan transkripsi pertuturan-ke-teks. Ia menghantar kembali teks secara berterusan melalui sambungan WebSocket yang selamat.
4.  **Paparan Masa Nyata**: Aplikasi menerima teks dari API dan mengemas kini antaramuka pengguna serta-merta, memberikan ilusi transkripsi masa nyata.

Untuk gambaran yang lebih terperinci tentang seni bina, sila rujuk fail `diagram.md`.

## Keperluan

- **Pelayar Web Moden**: Seperti Chrome, Firefox, Safari, atau Edge yang menyokong Web Audio API.
- **Kunci API Google Gemini**: Kunci API yang sah diperlukan untuk berinteraksi dengan perkhidmatan Gemini.
- **Sambungan HTTPS**: Atas sebab-sebab keselamatan, pelayar web memerlukan sambungan selamat (HTTPS) untuk membenarkan akses kepada mikrofon.
