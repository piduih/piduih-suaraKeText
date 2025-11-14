# Diagram Aliran Aplikasi Transkripsi Masa Nyata

Dokumen ini menerangkan aliran data dan seni bina aplikasi transkripsi masa nyata menggunakan Gemini API.

## Rajah Jujukan (Sequence Diagram)

Rajah berikut menggambarkan interaksi antara pengguna, aplikasi React, Web Audio API, dan Gemini Live API.

```mermaid
sequenceDiagram
    participant User
    participant ReactApp as Aplikasi React (Pelayar Web)
    participant WebAudioAPI as Web Audio API
    participant GeminiAPI as Gemini Live API

    User->>+ReactApp: Klik "Mula Rakam"
    ReactApp->>ReactApp: Panggil startListening()
    ReactApp->>User: Minta kebenaran mikrofon
    User-->>ReactApp: Beri kebenaran
    ReactApp->>+GeminiAPI: ai.live.connect()
    GeminiAPI-->>-ReactApp: Panggilan balik onopen (Sesi dibuka)
    ReactApp->>+WebAudioAPI: Sediakan AudioContext & ScriptProcessor
    
    loop Rakaman Audio
        WebAudioAPI->>ReactApp: Hantar ketulan audio (onaudioprocess)
        ReactApp->>ReactApp: Proses & kodkan audio ke PCM Base64
        ReactApp->>GeminiAPI: session.sendRealtimeInput(audio)
        GeminiAPI-->>ReactApp: Panggilan balik onmessage (Teks transkripsi)
        ReactApp->>ReactApp: Kemas kini state (transkrip sementara & sejarah)
        ReactApp-->>User: Paparkan teks pada skrin
    end

    User->>+ReactApp: Klik "Hentikan Rakaman"
    ReactApp->>ReactApp: Panggil stopListening()
    ReactApp->>GeminiAPI: session.close()
    ReactApp->>-WebAudioAPI: Hentikan pemprosesan audio
    GeminiAPI-->>-ReactApp: Panggilan balik onclose (Sesi ditutup)

```

## Komponen Utama

1.  **Pengguna (User)**: Memulakan dan menghentikan proses transkripsi melalui antaramuka pengguna.
2.  **Aplikasi React (React App)**:
    *   Menguruskan state aplikasi (cth., `isListening`, `transcriptionHistory`).
    *   Mengendalikan interaksi pengguna.
    *   Berkomunikasi dengan Gemini Live API.
    *   Memaparkan hasil transkripsi.
3.  **Web Audio API**:
    *   Menangkap audio daripada mikrofon pengguna.
    *   Memproses audio dalam ketulan kecil (chunks) untuk penstriman masa nyata.
4.  **Gemini Live API**:
    *   Menerima strim audio.
    *   Melakukan transkripsi pertuturan-ke-teks secara masa nyata.
    *   Menghantar kembali hasil transkripsi ke aplikasi React.

## Aliran Kerja Terperinci

1.  **Permulaan**: Apabila pengguna menekan butang "Mula Rakam", aplikasi meminta akses kepada mikrofon.
2.  **Sambungan Sesi**: Setelah kebenaran diberikan, aplikasi mewujudkan sambungan selamat (session) dengan Gemini Live API.
3.  **Penstriman Audio**: Web Audio API mula menangkap audio, memecahkannya kepada ketulan kecil, dan menghantarnya ke fungsi pemprosesan audio. Setiap ketulan dikodkan ke format PCM Base64 yang diperlukan oleh Gemini.
4.  **Penghantaran Data**: Ketulan audio yang telah dikodkan dihantar ke Gemini API melalui sesi yang telah diwujudkan.
5.  **Menerima Transkripsi**: Gemini API memproses audio secara berterusan dan menghantar kembali teks transkripsi (sementara dan akhir) melalui panggilan balik `onmessage`.
6.  **Kemas Kini Antaramuka**: Aplikasi mengemas kini state dengan teks yang diterima, yang secara automatik memaparkan transkripsi terkini kepada pengguna.
7.  **Penamatan**: Apabila pengguna menekan "Hentikan Rakaman", aplikasi menutup sesi dengan Gemini API dan menghentikan semua pemprosesan audio untuk melepaskan sumber.
