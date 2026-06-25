import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
  const [userLoaded, setUserLoaded] = useState(false);

  // ============================================================
  // 🔥 USEFFECT: BACA TOKEN DARI URL & LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    // 🔥 1. CEK TOKEN DI URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    console.log('🔍 ===== PUBLIC MAIN DEBUG =====');
    console.log('🔍 URL:', window.location.href);
    console.log('🔍 Token dari URL:', tokenFromUrl);
    
    if (tokenFromUrl) {
      // Simpan token ke localStorage
      localStorage.setItem('token', tokenFromUrl);
      
      // Hapus token dari URL (biar tidak terekspos)
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log('✅ Token saved from URL:', tokenFromUrl);
    }

    // 🔥 2. CEK TOKEN DI LOCALSTORAGE
    const token = localStorage.getItem('token');
    console.log('🔍 Token di localStorage:', token);
    console.log('🔍 User di localStorage:', localStorage.getItem('user'));
    console.log('🔍 ===== END DEBUG =====');

    // 🔥 3. VALIDASI TOKEN
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda harus login terlebih dahulu untuk mendaftar.',
        confirmButtonColor: '#1F3877'
      });
      // Redirect ke halaman login admin
      window.location.href = 'https://admin.asramaputrakukar.my.id/login';
      return;
    }

    // 🔥 4. AMBIL DATA USER DARI API
    const fetchUserData = async () => {
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
          console.log('✅ User data loaded:', userData);
        } else {
          console.error('❌ Gagal ambil data user:', response.status);
        }
      } catch (error) {
        console.error('❌ Error fetch user data:', error);
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

    const token = localStorage.getItem('token');
    console.log('🔍 Token saat submit:', token);

    // Validasi Token
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda harus login terlebih dahulu untuk mendaftar.',
        confirmButtonColor: '#1F3877'
      });
      setLoading(false);
      return;
    }

    // Validasi Email
    if (!formData.email) {
      Swal.fire({
        icon: 'error',
        title: 'Data Tidak Lengkap',
        text: 'Email tidak boleh kosong. Silakan login ulang.',
        confirmButtonColor: '#1F3877'
      });
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
      console.log('📡 Response submit:', result);

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pendaftaran Anda berhasil dikirim.',
          showConfirmButton: false,
          timer: 2000
        });

        setFormData({
          nama_lengkap: '',
          nim: '',
          universitas: '',
          program_studi: '',
          jenis_kelamin: 'Laki-laki',
          no_hp: '',
          email: formData.email,
          alamat_asal: ''
        });

        setTimeout(() => {
          navigate('/');
        }, 2000);

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: result.message || 'Pastikan data yang Anda masukkan sudah benar.',
          confirmButtonColor: '#1F3877'
        });
      }
    } catch (error) {
      console.error('❌ Koneksi error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Gagal terhubung ke server. Silakan coba beberapa saat lagi.',
        confirmButtonColor: '#1F3877'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-black placeholder-gray-400 focus:outline-none focus:border-p1 focus:ring-1 focus:ring-p1 transition-all duration-300";

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 sm:p-10 bg-white shadow-xl rounded-2xl text-black border border-slate-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-p1" />

        <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-slate-800">Form Pendaftaran Anggota Baru</h2>
        <p className="text-center text-gray-500 font-medium mb-8">Sistem Informasi Asrama Kutai Kartanegara Yogyakarta</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-sm">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama_lengkap" 
              value={formData.nama_lengkap} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Masukkan nama lengkap"
              required 
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label className="block font-semibold text-slate-700 mb-1.5 text-sm">NIM</label>
              <input 
                type="text" 
                name="nim" 
                value={formData.nim} 
                onChange={handleChange} 
                className={inputStyle}
                placeholder="Masukkan NIM"
                required 
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-slate-700 mb-1.5 text-sm">Jenis Kelamin</label>
              <select 
                name="jenis_kelamin" 
                value={formData.jenis_kelamin} 
                onChange={handleChange} 
                className={`${inputStyle} h-[49.5px] cursor-pointer`}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-sm">Universitas</label>
            <input 
              type="text" 
              name="universitas" 
              value={formData.universitas} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Contoh: Universitas Atma Jaya Yogyakarta"
              required 
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-sm">Program Studi</label>
            <input 
              type="text" 
              name="program_studi" 
              value={formData.program_studi} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Contoh: Informatika"
              required 
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-sm">No. HP / WhatsApp</label>
            <input 
              type="text" 
              name="no_hp" 
              value={formData.no_hp} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Contoh: 081234567890"
              required 
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-sm">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`w-full p-3 border border-slate-200 rounded-xl transition-all duration-300 ${userLoaded ? 'bg-slate-100 text-gray-500 cursor-not-allowed border-dashed' : 'bg-yellow-50 focus:outline-none focus:border-p1'}`}
              placeholder={userLoaded ? 'Email dari akun Anda' : 'Memuat email...'}
              readOnly={userLoaded}
              required 
            />
            <p className="text-xs font-medium text-gray-400 mt-1.5 px-1">
              {userLoaded ? '✉️ Email terkunci otomatis dari akun login Anda' : '⏳ Sedang memuat data user...'}
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-sm">Alamat Asal</label>
            <textarea 
              name="alamat_asal" 
              value={formData.alamat_asal} 
              onChange={handleChange} 
              className={`${inputStyle} h-28 resize-none`}
              placeholder="Masukkan alamat lengkap asal (Kutai Kartanegara)"
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full p-4 text-white font-bold rounded-xl shadow-md transition-all duration-300 tracking-wide mt-2 ${loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.99]'}`}
          >
            {loading ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
          </button>
        </form>
      </div>
    </div>
  );
}