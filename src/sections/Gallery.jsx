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
      const response = await axios.get(`${urlAPIBE}/api/v1/public/galleries?category_name=${category_name}`, {
        headers: { "X-API-KEY": APIKEY }
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
    <section>
      <Element name="gallery">
        {/* 🔥 CONTAINER SAMA SEPERTI PANDUAN PENDAFTARAN */}
        <div className="container" style={{ backgroundColor: '#FCE124', boxShadow: 'none' }}>
          <div 
            className="relative flex md:flex-wrap flex-nowrap border-2 border-s3 rounded-7xl md:overflow-hidden max-md:flex-col feature-after md:g7 max-md:border-none max-md:rounded-none max-md:gap-3"
            style={{ backgroundColor: '#FCE124', boxShadow: 'none' }}
          >
            {/* SISI KIRI - JUDUL DAN DESKRIPSI */}
            <div
              className="relative z-2 md:px-10 px-5 md:pb-10 pb-5 max-md:g7 max-md:border-2 max-md:border-s3 max-md:rounded-3xl flex-1"
              style={{ backgroundColor: '#FCE124', boxShadow: 'none' }}
            >
              <div className="w-full flex justify-start items-start">
                <div className="-ml-3 mb-12 flex items-center justify-center flex-col">
                  <div className="w-0.5 h-16 bg-s3" />
                  <img
                    src="/images/gallery-icon.png"
                    className="size-20 object-contain"
                    alt="gallery"
                  />
                </div>
              </div>

              <p className="caption mb-5 max-md:mb-6 text-black">
                Gallery Asrama Kami
              </p>
              
              <h2 className="mb-7 h3 text-black max-md:mb-6 max-md:h5">
                GALLERY ASRAMA KAMI
              </h2>
              
              <p className="mb-11 body-1 text-black max-md:mb-8 max-md:body-3">
                Berikut kumpulan dokumentasi dari aktivitas kami selama di asrama dan juga beberapa foto dari fasilitas yang ada di asrama.
              </p>
            </div>

            {/* SISI KANAN - LIST ICON KATEGORI */}
            <ul className="relative flex justify-around flex-grow px-[5%] border-2 border-s3 rounded-7xl max-md:hidden">
              <div className="absolute bg-s3/20 top-[38%] left-0 right-0 w-full h-[1px] z-10" />

              {links.map(({ id, title, url, icon }) => (
                <li key={id} className="relative pt-16 px-4 pb-14 flex flex-col h-full">
                  <div className="absolute top-8 bottom-0 left-1/2 bg-s3/20 w-[1px] h-full z-10" />

                  <button
                    onClick={() => fetchImages(title)}
                    className="flex items-center justify-center mx-auto mb-3 border-2 border-s2 rounded-full hover:border-s4 transition-all duration-500 size-20"
                    style={{ boxShadow: 'none', backgroundColor: '#FFFFFF' }}
                  >
                    <span className="download_tech-icon">{icon}</span>
                  </button>

                  <h3 className="relative z-2 max-w-36 mx-auto my-0 base-small text-center uppercase text-black">
                    {title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 🔥 BAGIAN PHOTOS - DENGAN CONTAINER YANG SAMA */}
        {photos.length > 0 && (
          <div className="container" style={{ backgroundColor: '#FCE124', boxShadow: 'none' }}>
            <div className="my-10 w-full py-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="h4 text-black">Photos - {selectedCategory}</h3>
                <div className="h-0.5 flex-1 bg-black/20 ml-6" />
              </div>
              <Slider {...photoSliderSettings} className="gallery-slider">
                {photos.map((photo) => (
                  <div key={photo.id} className="px-3">
                    <div 
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 border-s3 bg-s1 transition-all duration-500 hover:border-p1"
                      style={{ boxShadow: 'none', backgroundColor: '#FFFFFF' }}
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
          </div>
        )}

        {/* 🔥 BAGIAN VIDEOS - DENGAN CONTAINER YANG SAMA */}
        {videos.length > 0 && (
          <div className="container" style={{ backgroundColor: '#FCE124', boxShadow: 'none' }}>
            <div className="my-20 w-full py-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="h4 text-black">Videos - {selectedCategory}</h3>
                <div className="h-0.5 flex-1 bg-black/20 ml-6" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="group flex flex-col">
                    <div 
                      className="relative aspect-video overflow-hidden rounded-2xl border-2 border-s3 bg-s1 transition-all duration-500 hover:border-p1"
                      style={{ boxShadow: 'none', backgroundColor: '#FFFFFF' }}
                    >
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
                    <h4 className="mt-4 h6 text-black transition-colors group-hover:text-p1">{video.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
                <h4 className="h5 text-black font-bold mb-1">{selectedImage.title}</h4>
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