import { Link as LinkScroll } from "react-scroll";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { adminAsrama } from "../constants";

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    window.location.href = "https://admin.asramaputrakukar.my.id/login";
  };

  const NavLink = ({ title }) => (
    <LinkScroll
      onClick={() => setIsOpen(false)}
      to={title}
      offset={-100}
      spy
      smooth
      activeClass="nav-active"
      // 🔥 UBAH WARNA: text hitam, hover kuning
      className="base-bold text-black uppercase transition-colors duration-500 cursor-pointer hover:text-[#FCE124] max-lg:my-4 max-lg:h5"
    >
      {title}
    </LinkScroll>
  );

  const NavLinkExternal = ({ title, href, onClick }) => (
    <a
      href={href || "#"}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else if (!href || href === "#") {
          e.preventDefault(); 
        }
        setIsOpen(false);  
      }}
      // 🔥 UBAH WARNA: text hitam, hover kuning
      className="base-bold text-black uppercase transition-colors duration-500 cursor-pointer hover:text-[#FCE124] max-lg:my-4 max-lg:h5"
    >
      {title}
    </a>
  );

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500 max-lg:py-4",
        // 🔥 UBAH WARNA: background KUNING (#FCE124)
        hasScrolled ? "py-2 bg-[#FCE124] shadow-md" : "bg-[#FCE124]"
      )}
    >
      <div className="container flex h-14 items-center max-lg:px-5">
        <a className="lg:hidden flex-1 cursor-pointer z-2">
          <img src="/images/asrama.svg" width={55} height={55} alt="logo" />
        </a>

        <div
          className={clsx(
            // 🔥 UBAH WARNA: background KUNING (#FCE124)
            "w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-[#FCE124] max-lg:opacity-0",
            isOpen ? "max-lg:opacity-100" : "max-lg:pointer-events-none"
          )}
        >
          <div className="max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
            <nav className="max-lg:relative max-lg:z-2 max-lg:my-auto">
              <ul className="flex max-lg:block max-lg:px-12">
                <li className="nav-li">
                  <NavLink title="beranda" />
                  <div className="dot" />
                  <NavLink title="tentang asrama" />
                </li>

                <li className="nav-logo">
                  <LinkScroll
                    to="hero"
                    offset={-250}
                    spy
                    smooth
                    className={clsx(
                      "max-lg:hidden transition-transform duration-500 cursor-pointer"
                    )}
                  >
                    <img
                      src="/images/asrama.svg"
                      width={50}
                      height={55}
                      alt="logo"
                    />
                  </LinkScroll>
                </li>

                <li className="nav-li">
                  <NavLink title="bantuan & kontak" />
                  <div className="dot" />

                  {isLoggedIn ? (
                    <NavLinkExternal 
                      title="logout" 
                      onClick={handleLogout} 
                    />
                  ) : (
                    <NavLinkExternal 
                      title="admin" 
                      href="https://admin.asramaputrakukar.my.id/login"
                    />
                  )}
                </li>
              </ul>
            </nav>

            <div className="lg:hidden block absolute top-1/2 left-0 w-[960px] h-[380px] translate-x-[-290px] -translate-y-1/2 rotate-90">
              <img
                src="/images/bg-outlines.svg"
                width={960}
                height={380}
                alt="outline"
                className="relative z-2"
              />
              <img
                src="/images/bg-outlines-fill.png"
                width={960}
                height={380}
                alt="outline"
                className="absolute inset-0 mix-blend-soft-light opacity-5"
              />
            </div>
          </div>
        </div>

        <button
          className="lg:hidden z-2 size-10 border-2 border-black/25 rounded-full flex justify-center items-center"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <img
            src={`/images/icons/${isOpen ? "close" : "magic"}.svg`}
            alt="magic"
            className="size-1/2 object-contain"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;