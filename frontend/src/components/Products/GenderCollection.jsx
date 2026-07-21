import womenCollection from "../../assets/women-ollection.jpg";
import menCollection from "../../assets//mens-collection.jpg";
import { Link } from "react-router-dom";

const GenderCollection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* women collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <img
            src={womenCollection}
            alt="womens"
            className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-500"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"></div>

          {/* content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="mb-4 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-white">
              For Her
            </span>

            <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              Women's Collection
            </h1>

            <Link
              to={"/collections/all?gender=Women"}
              className="group/btn relative inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-black px-8 py-3.5 rounded-full font-semibold overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.45)] border border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Shop Now</span>
              <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent"></span>
            </Link>
          </div>
        </div>

        {/* mens collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <img
            src={menCollection}
            alt="mens"
            className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-500"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"></div>

          {/* content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="mb-4 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-white">
              For Him
            </span>

            <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              Men's Collection
            </h1>

            <Link
              to={"/collections/all?gender=Men"}
              className="group/btn relative inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-black px-8 py-3.5 rounded-full font-semibold overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.45)] border border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Shop Now</span>
              <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollection;
