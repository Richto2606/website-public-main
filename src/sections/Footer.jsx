import { socials } from "../constants/index.jsx";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    // 🔥 UBAH WARNA: background KUNING (#FCE124)
    <footer className="bg-[#FCE124] border-t border-black/10">
      <div className="container py-10">
        <div className="flex w-full max-md:flex-col">
          <div className="flex sm:ml-auto md:justify-center md:items-center">
            {/* 🔥 UBAH WARNA: text hitam, hover warna kuning emas */}
            <p className="legal-after relative mr-9 text-black transition-all duration-500 hover:text-[#FFD700]">
              {currentYear}
            </p>
            {/* 🔥 UBAH WARNA: text hitam, hover warna kuning emas */}
            <p className="text-black transition-all duration-500 hover:text-[#FFD700]">
              Asrama Putra Kutai Kartanegara
            </p>
          </div>

          <ul className="flex flex-1 justify-center gap-3 max-md:mt-10 md:justify-end">
            {socials.map(({ id, url, icon, title }) => (
              <li key={id}>
                <a 
                  href={url} 
                  className="social-icon bg-black/10 hover:bg-black/20 transition-all duration-300"
                >
                  <img
                    src={icon}
                    alt={title}
                    className="size-1/3 object-contain"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;