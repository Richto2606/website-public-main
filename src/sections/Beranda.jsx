import { Element, Link as LinkScroll } from "react-scroll";
import Button from "../components/Button.jsx";
import { homes, daftarAsrama } from "../constants/index.jsx";

const Beranda = () => {
  return (
    // Menggunakan bg-s1 untuk background putih bersih
    <section className="bg-s1 pt-60 pb-10 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      <Element name="beranda">
        <div className="container flex justify-between items-center space-x-[300px]">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            {/* Mengubah warna judul menjadi hitam pekat (text-p2) */}
            <h1 className="mb-6 h1 text-p2 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
              Asrama Putra Kutai Kartanegara
            </h1>
            {/* Mengubah warna deskripsi menjadi hitam pekat (text-p2) */}
            <p className="max-w-440 mb-14 body-1 text-p2 max-md:mb-10">
             <strong>Daftarkan diri anda sekarang</strong> dan jadilah bagian dari keluarga besar Asrama Kutai Negara
              di Yogyakarta. Asrama ini menjadi pilihan tepat bagi Anda yang ingin fokus belajar, berkembang, dan meraih prestasi.
            </p>
            <div className="flex space-x-4">
              {/* Properti warna text button disesuaikan menjadi putih */}
              <Button textFont={'text-s1'} href={daftarAsrama}>Daftar Disini</Button>
              <LinkScroll to="panduan pendaftaran" offset={-100} spy smooth>
                <Button textFont={'text-s1'}>Panduan Pendaftaran</Button>
              </LinkScroll>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {homes.map(({ id, icon, text }) => (
                <div className="flex items-center gap-4" key={id}>
                  <img
                    src={icon}
                    alt={text}
                    className="object-contain"
                  />
                  <div>
                    {/* Mengubah warna text fasilitas menjadi hitam pekat (text-p2) */}
                    <p className="font-semibold text-p2">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[1230px] max-lg:w-[900px] max-md:w-[600px]">
            <img
              src="/images/bg-beranda-1.png"
              className="w-[400px] h-auto"
              alt="hero"
            />
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Beranda;