// Gallery.jsx - Ubah menjadi seperti Panduan Pendaftaran

import { Element } from "react-scroll";
import { links, APIKEY, urlAPIBE } from "../constants/index.jsx";
import axios from "axios";
import { useState, useEffect } from "react";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(links[0]?.title);

  useEffect(() => {
    fetchImages(links[0]?.title);
  }, []);

  const fetchImages = async (category_name) => {
    try {
      const response = await axios.get(`${urlAPIBE}/api/v1/public/galleries?category_name=${category_name}`, {
        headers: { "X-API-KEY": APIKEY }
      });
      const res = response.data;
      if (res.success) {
        setPhotos(res.data.filter((item) => item.type === "Foto"));
        setSelectedCategory(category_name);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <section>
      <Element name="gallery">
        {/* 🔥 CONTAINER SAMA SEPERTI PANDUAN */}
        <div className="container" style={{ backgroundColor: '#FCE124' }}>
          <div className="relative flex md:flex-wrap flex-nowrap border-2 border-s3 rounded-7xl md:overflow-hidden max-md:flex-col feature-after md:g7 max-md:border-none max-md:rounded-none max-md:gap-3">
            
            {/* SISI KIRI - JUDUL */}
            <div className="relative z-2 md:px-10 px-5 md:pb-10 pb-5 flex-1" style={{ backgroundColor: '#FCE124' }}>
              <div className="w-full flex justify-start items-start">
                <div className="-ml-3 mb-12 flex items-center justify-center flex-col">
                  <div className="w-0.5 h-16 bg-s3" />
                  <img src="/images/gallery-icon.png" className="size-20 object-contain" alt="gallery" />
                </div>
              </div>
              <p className="caption mb-5 text-black">Gallery Asrama Kami</p>
              <h2 className="mb-7 h3 text-black">GALLERY ASRAMA KAMI</h2>
              <p className="mb-11 body-1 text-black">
                Berikut kumpulan dokumentasi dari aktivitas kami selama di asrama dan juga beberapa foto dari fasilitas yang ada di asrama.
              </p>
            </div>

            {/* SISI KANAN - LIST KATEGORI (SEPERTI STEP) */}
            <ul className="relative flex justify-around flex-grow px-[5%] border-2 border-s3 rounded-7xl max-md:hidden">
              {links.map(({ id, title, icon }) => (
                <li key={id} className="relative pt-16 px-4 pb-14 flex flex-col h-full">
                  <button
                    onClick={() => fetchImages(title)}
                    className="flex items-center justify-center mx-auto mb-3 border-2 border-s2 rounded-full hover:border-s4 transition-all duration-500 size-20"
                    style={{ backgroundColor: '#FFFFFF', boxShadow: 'none' }}
                  >
                    <span className="text-3xl">{icon}</span>
                  </button>
                  <h3 className="text-center uppercase text-black text-sm font-semibold">{title}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 🔥 FOTO - SEPERTI CARD DI PANDUAN */}
        <div className="container" style={{ backgroundColor: '#FCE124' }}>
          <div className="py-8">
            <h3 className="h4 text-black mb-6">Photos - {selectedCategory}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-none" style={{ boxShadow: 'none' }}>
                  <img src={urlAPIBE + photo.file} alt={photo.title} className="w-full h-48 object-cover" />
                  <p className="p-3 text-black text-sm font-medium text-center">{photo.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Gallery;