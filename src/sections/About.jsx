import { Element } from "react-scroll";
import { abouts } from "../constants";

const About = () => {
  return (
    <section>
      <Element name="tentang asrama">
        {/* 🔥 BACKGROUND CONTAINER: #FCE124 (KUNING) */}
        <div 
          className="container space-y-2 mt-4"
          style={{ 
            backgroundColor: '#FCE124',
            boxShadow: 'none'
          }}
        >
          {abouts.map(({ id, title, description, icon, isItems, items }) => (
            <div 
              className="relative flex md:flex-wrap flex-nowrap border-2 border-s3 rounded-7xl md:overflow-hidden max-md:flex-col feature-after md:g7 max-md:border-none max-md:rounded-none max-md:gap-3"
              key={id}
              style={{ 
                backgroundColor: '#FCE124',
                boxShadow: 'none'
              }}
            >
              <div
                className="relative z-2 md:px-10 px-5 md:pb-10 pb-5 max-md:g7 max-md:border-2 max-md:border-s3 max-md:rounded-3xl flex-1"
                style={{ 
                  backgroundColor: '#FCE124',
                  boxShadow: 'none'
                }}
              >
                <div className="w-full flex justify-start items-start">
                  <div className="-ml-3 mb-12 flex items-center justify-center flex-col">
                    <div className="w-0.5 h-16 bg-s3" /> 
                    <img
                      src={icon}
                      className="size-20 object-contain"
                      alt={title}
                    />
                  </div>
                </div>

                <p className="mb-5 max-md:mb-6 uppercase text-black text-3xl md:text-4xl font-bold tracking-wider">
                  {title}
                </p>
                
                <p className="mb-11 body-1 text-black max-md:mb-8 max-md:body-3">
                  {description}
                </p>
                
                {isItems && items && (
                  <div className="grid grid-cols-2 gap-4">
                    {items.map(({ id, icon, title, text }) => (
                      <div className="flex items-center gap-4" key={id}>
                        {/* 🔥 BOX ICON: TETAP KUNING ATAU PUTIH */}
                        <div 
                          className="p-3 rounded-full"
                          style={{ 
                            backgroundColor: '#FFFFFF',
                            boxShadow: 'none'
                          }}
                        >
                          <img
                            src={icon}
                            alt={title}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-black">{title}</p>
                          <p className="text-black text-sm">
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </Element>
    </section>
  );
};

export default About;