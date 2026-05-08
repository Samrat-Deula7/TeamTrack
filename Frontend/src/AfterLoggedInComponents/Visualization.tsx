import Time from "../assets/time.gif";

export default function Visualization() {
  return (
    <>
      <div className="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 2xl:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="flex flex-col  justify-center items-center lg:items-start gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-full mx-auto">
          <div className="flex flex-col 2xl:flex-row gap-4 sm:gap-5 md:gap-6  lg:flex-1 w-full">
            <div
              className="w-full 
                          h-48 sm:h-56 md:h-80 lg:h-96 2xl:h-190
                          bg-white/20 backdrop-blur-md shadow-lg rounded-2xl border border-white/10"
            >
              <div className="relative w-60 h-20 bg-green-500 font-bold text-white rounded-2xl transition-transform animate-bounce px-4 py-4">
                Feature Coming Soon
                <span className="font-extrabold">!!</span>
                <img
                  src={Time}
                  alt="time_icon"
                  className="absolute left-40 -bottom-10 w-[80px] h-[80px] rounded-full"
                />
              </div>
            </div>

            <div
              className="w-full 
                          h-40 sm:h-48 md:h-56 lg:h-64 2xl:h-190 
                          bg-white/20 backdrop-blur-md shadow-lg rounded-2xl border border-white/10"
            >
              <div className="relative w-60 h-20 bg-green-500 font-bold text-white rounded-2xl transition-transform animate-bounce px-4 py-4">
                Feature Coming Soon
                <span className="font-extrabold">!!</span>
                <img
                  src={Time}
                  alt="time_icon"
                  className="absolute left-40 -bottom-10 w-[80px] h-[80px] rounded-full"
                />
              </div>
            </div>
          </div>

          <div
            className="w-full 
                          h-48 sm:h-56 md:h-80 lg:h-96 2xl:h-190
                          bg-white/20 backdrop-blur-md shadow-lg rounded-2xl border border-white/10"
          >
            <div className="relative w-60 h-20 bg-green-500 font-bold text-white rounded-2xl transition-transform animate-bounce px-4 py-4">
              Feature Coming Soon
              <span className="font-extrabold">!!</span>
              <img
                src={Time}
                alt="time_icon"
                className="absolute left-40 -bottom-10 w-[80px] h-[80px] rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
