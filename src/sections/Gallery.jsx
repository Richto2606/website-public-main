import { Element } from "react-scroll";
import { axiosUrl, links, APIKEY, urlAPIBE } from "../constants/index.jsx";
import { Marker } from "../components/Marker.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import ReactPlayer from 'react-player/youtube';

const Gallery = () => {
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(links[0]?.title);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages(links[0]?.title);
  }, []);

  const fetchImages = async (category_name) => {
    setVideos([]);
    setPhotos([]);
    try {
      const response = await axios.get(`${axiosUrl}/galleries?category_name=${category_name}`, {
        headers: {
          "X-API-KEY": APIKEY,
        },
      });

      const res = response.data;
      if (res.success && res.count > 0) {
        const videoList = res.data.filter((item) => item.type === "Video");
        const photoList = res.data.filter((item) => item.type === "Foto");

        setVideos(videoList);
        setPhotos(photoList);
        setSelectedCategory(category_name);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const photoSliderSettings = {
    dots: true,
    infinite: photos.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="mt-2">
      <Element name="gallery" className="g7 relative pb-32 pt-24 max-lg:pb-24 max-md:py-16">
        <div className="container">
          <div className="flex items-center">
            <div className="relative mr-6 flex-540 max-xl:flex-280 max-lg:flex256 max-md:flex-100">
              <div className="mb-8">
                {/* 🔥 UBAH: Judul menjadi HITAM (text-black) */}
                <h2 className="text-2xl font-bold text-black mb-4">GALLERY ASRAMA KAMI</h2>
              </div>

              {/* 🔥 UBAH: Deskripsi menjadi HITAM (text-black) */}
              <p className="body-1 mb-10 max-w-md text-black">
                Berikut kumpulan dokumentasi dari aktivitas kami selama di asrama dan juga beberapa foto dari fasilitas yang ada di asrama.
              </p>

              <ul className="flex flex-wrap items-center gap-[80px]">
                {links.map(({ id, title, url, icon }) => (
                  <li key={id} className="download_tech-link ">
                    <button
                      onClick={() => fetchImages(title)}
                      className="size-22 download_tech-icon_before relative flex items-center justify-center rounded-half border-2 border-s3 bg-s1 transition-borderColor duration-500"
                    >
                      <span className="absolute -top-2 rotate-90">
                        <Marker fill={"#C4CBF5"} />
                      </span>
                      <img src={"/images/lines.svg"} alt="lines" className="absolute size-13/20 object-contain" />
                      <span className="download_tech-icon">{icon}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="my-10 w-full">
              <div className="flex items-center justify-between mb-8">
                {/* 🔥 UBAH: Judul kategori menjadi HITAM (text-black) */}
                <h3 className="h4 text-black">Photos - {selectedCategory}</h3>
                <div className="h-0.5 flex-1 bg-s3 ml-6 opacity-20" />
              </div>
              <Slider {...photoSliderSettings} className="gallery-slider">
                {photos.map((photo) => (
                  <div key={photo.id} className="px-3">
                    <div 
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 border-s3 bg-s1 shadow-2xl transition-all duration-500 hover:border-p1"
                      onClick={() => setSelectedImage(photo)}
                    >
                      {photo.file && (
                        <img
                          src={urlAPIBE + photo.file}
                          alt={photo.title}
                          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                          <p className="h6 text-p1 mb-1">{photo.title}</p>
                          <p className="body-3 text-s1">Klik untuk memperbesar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {videos.length > 0 && (
            <div className="my-20 w-full">
              <div className="flex items-center justify-between mb-8">
                {/* 🔥 UBAH: Judul kategori menjadi HITAM (text-black) */}
                <h3 className="h4 text-black">Videos - {selectedCategory}</h3>
                <div className="h-0.5 flex-1 bg-s3 ml-6 opacity-20" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="group flex flex-col">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-s3 bg-s1 shadow-2xl transition-all duration-500 hover:border-p1">
                      {video.url && (
                        <ReactPlayer
                          url={video.url}
                          width="100%"
                          height="100%"
                          controls={true}
                          light={true}
                        />
                      )}
                    </div>
                    {/* 🔥 UBAH: Judul video menjadi HITAM (text-black) */}
                    <h4 className="mt-4 h6 text-black transition-colors group-hover:text-p1">{video.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Element>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center animate-in zoom-in duration-300">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-p1 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-s3 bg-s1 shadow-2xl">
              <img
                src={urlAPIBE + selectedImage.file}
                alt={selectedImage.title}
                className="max-h-[80vh] w-full object-contain"
              />
              <div className="bg-s1 p-6 text-center border-t border-s3">
                {/* 🔥 UBAH: Judul gambar menjadi HITAM (text-black) */}
                <h4 className="h5 text-black font-bold mb-1">{selectedImage.title}</h4>
                {/* 🔥 UBAH: Kategori menjadi HITAM (text-black) */}
                <p className="body-3 text-black font-semibold">{selectedCategory}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;