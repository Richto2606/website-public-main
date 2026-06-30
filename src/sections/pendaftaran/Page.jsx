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
    alamat_asal: '',
    nama_wali: '',
    semester: '',
    no_ortu_wali: '',
    nama_ortu_wali: '',
    file_berkas: null
  });

  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    console.log('🔍 ===== PUBLIC MAIN DEBUG =====');
    console.log('🔍 URL:', window.location.href);
    console.log('🔍 Token dari URL:', tokenFromUrl);
    
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log('✅ Token saved from URL:', tokenFromUrl);
    }

    const token = localStorage.getItem('token');
    console.log('🔍 Token di localStorage:', token);
    console.log('🔍 User di localStorage:', localStorage.getItem('user'));
    console.log('🔍 ===== END DEBUG =====');

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda harus login terlebih dahulu untuk mendaftar.',
        confirmButtonColor: '#FCE124'
      });
      window.location.href = 'https://admin.asramaputrakukar.my.id/login';
      return;
    }

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
    console.log('🔄 handleChange:', e.target.name, '=', e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: 'Ukuran file maksimal 2MB.',
          confirmButtonColor: '#FCE124'
        });
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Format File Tidak Didukung',
          text: 'Hanya file DOC, DOCX, JPG, JPEG, PNG, PDF yang diperbolehkan.',
          confirmButtonColor: '#FCE124'
        });
        e.target.value = '';
        return;
      }
      
      console.log('📎 File selected:', file.name);
      setFormData({
        ...formData,
        file_berkas: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    console.log('🔍 Token saat submit:', token);

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda harus login terlebih dahulu untuk mendaftar.',
        confirmButtonColor: '#FCE124'
      });
      setLoading(false);
      return;
    }

    console.log('📦 FORM DATA STATE SEBELUM KIRIM:', formData);

    const formDataToSend = new FormData();
    formDataToSend.append('nama_lengkap', formData.nama_lengkap || '');
    formDataToSend.append('nim', formData.nim || '');
    formDataToSend.append('universitas', formData.universitas || '');
    formDataToSend.append('program_studi', formData.program_studi || '');
    formDataToSend.append('jenis_kelamin', formData.jenis_kelamin || 'Laki-laki');
    formDataToSend.append('no_hp', formData.no_hp || '');
    formDataToSend.append('email', formData.email || '');
    formDataToSend.append('alamat_asal', formData.alamat_asal || '');
    formDataToSend.append('nama_wali', formData.nama_wali || '');
    formDataToSend.append('semester', formData.semester || '');
    formDataToSend.append('no_ortu_wali', formData.no_ortu_wali || '');
    formDataToSend.append('nama_ortu_wali', formData.nama_ortu_wali || '');
    if (formData.file_berkas) {
      formDataToSend.append('file_berkas', formData.file_berkas);
    }

    console.log('📦 FORM DATA YANG DIKIRIM:');
    for (let pair of formDataToSend.entries()) {
      if (pair[0] === 'file_berkas' && pair[1] instanceof File) {
        console.log(pair[0] + ': ' + pair[1].name + ' (' + pair[1].size + ' bytes)');
      } else {
        console.log(pair[0] + ': ' + pair[1]);
      }
    }

    try {
      const response = await fetch('https://asramaputrakukar.my.id/api/v1/pendaftaran', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': '881182541952993820593968'
        },
        body: formDataToSend
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
          alamat_asal: '',
          nama_wali: '',
          semester: '',
          no_ortu_wali: '',
          nama_ortu_wali: '',
          file_berkas: null
        });

        const fileInput = document.getElementById('file_berkas');
        if (fileInput) fileInput.value = '';

        setTimeout(() => {
          navigate('/');
        }, 2000);

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: result.message || 'Pastikan data yang Anda masukkan sudah benar.',
          confirmButtonColor: '#FCE124'
        });
      }
    } catch (error) {
      console.error('❌ Koneksi error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Gagal terhubung ke server. Silakan coba beberapa saat lagi.',
        confirmButtonColor: '#FCE124'
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 UBAH WARNA INPUT STYLE: border fokus menjadi KUNING
  const inputStyle = "w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-black placeholder-gray-400 focus:outline-none focus:border-[#FCE124] focus:ring-1 focus:ring-[#FCE124] transition-all duration-300";

  return (
    <div className="w-full min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 sm:p-10 bg-white shadow-xl rounded-2xl text-black border border-slate-100 relative overflow-hidden">
        
        {/* 🔥 UBAH WARNA GARIS ATAS: KUNING */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FCE124]" />

        <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-black">Form Pendaftaran Anggota Baru</h2>
        <p className="text-center text-gray-600 font-medium mb-8">Sistem Informasi Asrama Kutai Kartanegara Yogyakarta</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">Nama Lengkap</label>
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
              <label className="block font-semibold text-black mb-1.5 text-sm">NIM</label>
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
              <label className="block font-semibold text-black mb-1.5 text-sm">Jenis Kelamin</label>
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
            <label className="block font-semibold text-black mb-1.5 text-sm">Universitas</label>
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
            <label className="block font-semibold text-black mb-1.5 text-sm">Program Studi</label>
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
            <label className="block font-semibold text-black mb-1.5 text-sm">No. HP / WhatsApp</label>
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
            <label className="block font-semibold text-black mb-1.5 text-sm">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`w-full p-3 border border-slate-200 rounded-xl transition-all duration-300 ${userLoaded ? 'bg-slate-100 text-gray-500 cursor-not-allowed border-dashed' : 'bg-yellow-50 focus:outline-none focus:border-[#FCE124]'}`}
              placeholder={userLoaded ? 'Email dari akun Anda' : 'Memuat email...'}
              readOnly={userLoaded}
              required 
            />
            <p className="text-xs font-medium text-gray-400 mt-1.5 px-1">
              {userLoaded ? '✉️ Email terkunci otomatis dari akun login Anda' : '⏳ Sedang memuat data user...'}
            </p>
          </div>

          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">Alamat Asal</label>
            <textarea 
              name="alamat_asal" 
              value={formData.alamat_asal} 
              onChange={handleChange} 
              className={`${inputStyle} h-28 resize-none`}
              placeholder="Masukkan alamat lengkap asal (Kutai Kartanegara)"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">Nama Wali</label>
            <input 
              type="text" 
              name="nama_wali" 
              value={formData.nama_wali} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Masukkan nama wali"
            />
          </div>

          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">Semester</label>
            <input 
              type="number" 
              name="semester" 
              value={formData.semester} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Contoh: 4"
              min="1"
              max="14"
            />
          </div>

          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">No. Telepon Orang Tua/Wali</label>
            <input 
              type="text" 
              name="no_ortu_wali" 
              value={formData.no_ortu_wali} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Contoh: 081234567890"
            />
          </div>

          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">Nama Orang Tua/Wali (Ayah)</label>
            <input 
              type="text" 
              name="nama_ortu_wali" 
              value={formData.nama_ortu_wali} 
              onChange={handleChange} 
              className={inputStyle}
              placeholder="Masukkan nama ayah/wali"
            />
          </div>

          <div>
            <label className="block font-semibold text-black mb-1.5 text-sm">Upload Berkas</label>
            <input 
              type="file" 
              id="file_berkas"
              name="file_berkas" 
              onChange={handleFileChange}
              className={`${inputStyle} p-2 cursor-pointer`}
              accept=".doc,.docx,.jpg,.jpeg,.png,.pdf"
            />
            <p className="text-xs text-gray-400 mt-1">Format: DOC, DOCX, JPG, JPEG, PNG, PDF (Max 2MB)</p>
            {formData.file_berkas && (
              <p className="text-xs text-green-600 mt-1">
                ✅ File terpilih: {formData.file_berkas.name}
              </p>
            )}
          </div>

          {/* 🔥 UBAH WARNA TOMBOL: KUNING DENGAN TEKS HITAM */}
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full p-4 font-bold rounded-xl shadow-md transition-all duration-300 tracking-wide mt-2 ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500' 
                : 'bg-[#FCE124] hover:bg-[#FFD700] text-black hover:shadow-lg active:scale-[0.99]'
            }`}
          >
            {loading ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
          </button>
        </form>
      </div>
    </div>
  );
}