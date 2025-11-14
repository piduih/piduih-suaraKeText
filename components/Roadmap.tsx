import React from 'react';

interface RoadmapProps {
  isVisible: boolean;
  onClose: () => void;
}

const RoadmapSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-slate-700 mb-3 border-b-2 border-blue-200 pb-2">{title}</h3>
    <ul className="list-disc list-inside space-y-2 text-slate-600">
      {children}
    </ul>
  </div>
);

export const Roadmap: React.FC<RoadmapProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationName: 'fade-in-scale', animationDuration: '0.3s', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-800">Pelan Pembangunan Aplikasi</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <RoadmapSection title="Fasa 1: Penambahbaikan Jangka Pendek (Kualiti & Kawalan)">
            <li><strong>Butang Salin:</strong> Salin keseluruhan transkripsi ke papan keratan dengan satu klik.</li>
            <li><strong>Pilihan Eksport Tambahan:</strong> Tambah pilihan untuk simpan sebagai fail teks (.txt).</li>
            <li><strong>Cap Masa (Timestamp):</strong> Paparkan cap masa di sebelah setiap segmen transkripsi.</li>
            <li><strong>Visualisasi Audio:</strong> Tambah bar visual untuk menunjukkan mikrofon sedang menangkap bunyi.</li>
          </RoadmapSection>

          <RoadmapSection title="Fasa 2: Rancangan Jangka Sederhana (Ciri Pintar)">
            <li><strong>Sokongan Pelbagai Bahasa:</strong> Benarkan pengguna memilih bahasa transkripsi.</li>
            <li><strong>Sunting Transkripsi:</strong> Benarkan pengguna menyunting teks transkripsi terus dalam aplikasi.</li>
            <li><strong>Fungsi Carian:</strong> Cari perkataan atau frasa tertentu dalam sejarah transkripsi.</li>
            <li><strong>Ringkasan Automatik:</strong> Guna Gemini untuk mencipta ringkasan daripada keseluruhan teks transkripsi.</li>
          </RoadmapSection>

          <RoadmapSection title="Fasa 3: Visi Jangka Panjang (Alat Produktiviti Penuh)">
            <li><strong>Diarisasi Penutur:</strong> Kesan dan labelkan penutur yang berbeza secara automatik.</li>
            <li><strong>Integrasi Awan:</strong> Simpan transkripsi terus ke perkhidmatan seperti Google Drive.</li>
            <li><strong>Mod PWA (Progressive Web App):</strong> Pasang aplikasi pada desktop atau skrin utama telefon.</li>
            <li><strong>Kosa Kata Tersuai:</strong> Tambah perkataan atau jargon khusus untuk meningkatkan ketepatan.</li>
          </RoadmapSection>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-right sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};