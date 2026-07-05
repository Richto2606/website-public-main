import clsx from "clsx";
import { Marker } from "./Marker.jsx";

const Button = ({
  icon,
  children,
  href,
  textFont,
  containerClassName,
  onClick,
  markerFill,
}) => {
  const Inner = () => (
    <>
      {/* 🔥 UBAH WARNA BUTTON: PUTIH */}
      <span className="relative flex items-center min-h-[60px] px-4 bg-white rounded-2xl inner-before group-hover:before:opacity-100 overflow-hidden hover:bg-gray-100 transition-colors duration-300">
        <span className="absolute -left-[1px]">
          <Marker markerFill={markerFill || "#000000"} />
        </span>

        {icon && (
          <img
            src={icon}
            alt="circle"
            className="size-10 mr-5 object-contain z-10"
          />
        )}

        {/* 🔥 UBAH WARNA TEKS: HITAM */}
        <span className={`relative z-2 font-poppins base-bold text-black uppercase`}>
          {children}
        </span>
      </span>

      {/* 🔥 HAPUS GLOW ATAU UBAH WARNA */}
      <span className="glow-before glow-after" style={{ display: 'none' }} />
    </>
  );
  
  return href ? (
    <a
      className={clsx(
        "relative p-0.5 rounded-2xl group",
        containerClassName,
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Inner />
    </a>
  ) : (
    <button
      className={clsx(
        "relative p-0.5 rounded-2xl group",
        containerClassName,
      )}
      onClick={onClick}
    >
      <Inner />
    </button>
  );
};

export default Button;