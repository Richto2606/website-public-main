import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function PendaftaranPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nim: '',
    universitas: '',
    program_studi: '',
    jenis_kelamin: 'Laki-laki',
    no_hp: '',
    alamat_asal: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Ambil token dari brankas Vite
    const token = localStorage.getItem('token'); 

    if (!token) {
      setMessage({ type: 'error', text: 'Anda harus login terlebih dahulu untuk mendaftar.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://asramaputrakukar.my.id/api/v1/pendaftaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Tambahkan baris API Key di bawah ini!
          // Sesuaikan nama headernya ('x-api-key' atau 'api-key') dengan yang diminta Laravel-mu
          'x-api-key': '881182541952993820593968' 
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pendaftaran Anda berhasil dikirim! Mengalihkan ke beranda...' });
        
        // Kosongkan form kembali
        setFormData({
          nama_lengkap: '', nim: '', universitas: '', program_studi: '',
          jenis_kelamin: 'Laki-laki', no_hp: '', alamat_asal: ''
        });

        // Lempar ke beranda setelah jeda 2 detik
        setTimeout(() => {
          navigate('/'); // Pindah ke route utama (Beranda)
        }, 2000); 

      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal mengirim pendaftaran.' });
      }
    } catch (error) {
      console.error('Koneksi error:', error);
      setMessage({ type: 'error', text: 'Gagal terhubung ke server backend.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg text-black">
      <h2 className="text-2xl font-bold text-center mb-2">Form Pendaftaran Anggota Baru</h2>
      <p className="text-center text-gray-600 mb-6">Sistem Informasi Asrama Kutai Kartanegara Yogyakarta</p>

      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">Nama Lengkap</label>
          <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">NIM</label>
            <input type="text" name="nim" value={formData.nim} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Universitas</label>
          <input type="text" name="universitas" value={formData.universitas} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block font-semibold mb-1">Program Studi</label>
          <input type="text" name="program_studi" value={formData.program_studi} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block font-semibold mb-1">No. HP / WhatsApp</label>
          <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block font-semibold mb-1">Alamat Asal</label>
          <textarea name="alamat_asal" value={formData.alamat_asal} onChange={handleChange} className="w-full p-2 border rounded h-24" required></textarea>
        </div>

        <button type="submit" disabled={loading} className={`w-full p-3 text-white font-bold rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {loading ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
        </button>
      </form>
    </div>
  );
}   