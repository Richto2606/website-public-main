import React, { useState, useEffect } from 'react'; // <-- Tambahkan useEffect
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
    email: '',
    alamat_asal: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userLoaded, setUserLoaded] = useState(false); // <-- Tambahkan state

  // 🔥 AUTO-FILL EMAIL DARI DATA USER
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('Token tidak ditemukan');
        return;
      }

      try {
        const response = await fetch('https://asramaputrakukar.my.id/api/v1/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'x-api-key': '881182541952993820593968'
          }
        });

        if (response.ok) {
          const result = await response.json();
          const userData = result.data || result;
          
          setFormData(prev => ({
            ...prev,
            email: userData.email || '',
            nama_lengkap: userData.name || userData.nama_lengkap || ''
          }));
          setUserLoaded(true);
        } else {
          console.error('Gagal ambil data user:', response.status);
        }
      } catch (error) {
        console.error('Error fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage({ type: 'error', text: 'Anda harus login terlebih dahulu untuk mendaftar.' });
      setLoading(false);
      return;
    }

    // Validasi email harus terisi
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Email tidak boleh kosong. Silakan login ulang.' });
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
          'x-api-key': '881182541952993820593968'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pendaftaran Anda berhasil dikirim! Mengalihkan ke beranda...' });

        // Reset form tapi pertahankan email
        setFormData({
          nama_lengkap: '',
          nim: '',
          universitas: '',
          program_studi: '',
          jenis_kelamin: 'Laki-laki',
          no_hp: '',
          email: formData.email, // Pertahankan email
          alamat_asal: ''
        });

        setTimeout(() => {
          navigate('/');
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
          <input 
            type="text" 
            name="nama_lengkap" 
            value={formData.nama_lengkap} 
            onChange={handleChange} 
            className="w-full p-2 border rounded bg-gray-50" 
            required 
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">NIM</label>
            <input 
              type="text" 
              name="nim" 
              value={formData.nim} 
              onChange={handleChange} 
              className="w-full p-2 border rounded" 
              required 
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Jenis Kelamin</label>
            <select 
              name="jenis_kelamin" 
              value={formData.jenis_kelamin} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Universitas</label>
          <input 
            type="text" 
            name="universitas" 
            value={formData.universitas} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Program Studi</label>
          <input 
            type="text" 
            name="program_studi" 
            value={formData.program_studi} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">No. HP / WhatsApp</label>
          <input 
            type="text" 
            name="no_hp" 
            value={formData.no_hp} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>

        {/* 🔥 INPUT EMAIL - OTOMATIS TERISI & READONLY */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={`w-full p-2 border rounded ${userLoaded ? 'bg-gray-100 cursor-not-allowed' : 'bg-yellow-50'}`}
            placeholder={userLoaded ? 'Email dari akun Anda' : 'Memuat email...'}
            readOnly={userLoaded}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">
            {userLoaded ? '✉️ Email otomatis dari akun registrasi Anda' : '⏳ Sedang memuat data user...'}
          </p>
        </div>

        <div>
          <label className="block font-semibold mb-1">Alamat Asal</label>
          <textarea 
            name="alamat_asal" 
            value={formData.alamat_asal} 
            onChange={handleChange} 
            className="w-full p-2 border rounded h-24" 
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full p-3 text-white font-bold rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
        </button>
      </form>
    </div>
  );
}git add .
git commit -m "Add pendaftaran page with email column"
git push origin main