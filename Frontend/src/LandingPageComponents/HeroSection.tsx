function HeroSection() {
  const animation = "duration-500 ease-in-out  transition-all";

  function focus(e: React.MouseEvent<HTMLDivElement>): void {
    const clickedDiv = e.currentTarget;

    console.log(clickedDiv);
    clickedDiv.classList.add("focus");
    clickedDiv.classList.add("z-1000");
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      clickedDiv.classList.remove("focus");
      clickedDiv.classList.remove("z-1000");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    }, 2000);
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen py-10 sm:py-12 md:py-16 lg:py-20">
        <h1 className="text-green-500 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8 sm:mb-12 md:mb-16 px-4">
          Our <span className="text-white font-normal">Services</span>
        </h1>

        <div className="lg:hidden w-full px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
            <div
              onClick={focus}
              className={`w-full aspect-square bg-amber-200 rounded-full ${animation} hover:scale-110 cursor-pointer shadow-lg`}
            ></div>
            <div
              onClick={focus}
              className={`w-full aspect-square bg-red-600 rounded-3xl ${animation} hover:scale-110 cursor-pointer shadow-lg`}
            ></div>
            <div
              onClick={focus}
              className={`w-full aspect-square bg-green-400 rounded-full ${animation} hover:scale-110 cursor-pointer shadow-lg`}
            ></div>
            <div
              onClick={focus}
              className={`w-full aspect-square bg-blue-400 rounded-4xl ${animation} hover:scale-110 cursor-pointer shadow-lg`}
            ></div>
            <div
              onClick={focus}
              className={`w-full col-span-2 aspect-[2/1] max-w-md mx-auto bg-purple-900 rounded-full ${animation} hover:scale-110 cursor-pointer shadow-lg`}
            ></div>
          </div>
        </div>

        <div className="hidden lg:flex w-full h-screen justify-center items-start bg-transparent relative">
          <div className="relative w-full max-w-7xl h-full">
            <div
              onClick={focus}
              className={`absolute lg:top-16 lg:left-[12%] xl:top-20 xl:left-[15%] 2xl:top-24 2xl:left-[18%]
                        w-60 h-60 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96
                        bg-amber-200 rounded-full ${animation} 
                        hover:scale-110 cursor-pointer shadow-xl`}
            ></div>

            <div
              onClick={focus}
              className={`absolute lg:top-44 lg:left-[5%] xl:top-52 xl:left-[8%] 2xl:top-60 2xl:left-[10%]
                        w-48 h-48 lg:w-52 lg:h-52 xl:w-65 xl:h-65 2xl:w-72 2xl:h-72
                        bg-red-600 rounded-3xl ${animation} 
                        hover:scale-110 cursor-pointer shadow-xl`}
            ></div>

            <div
              onClick={focus}
              className={`absolute lg:top-20 lg:right-[10%] xl:top-24 xl:right-[12%] 2xl:top-28 2xl:right-[15%]
                        w-52 h-52 lg:w-56 lg:h-56 xl:w-60 xl:h-60 2xl:w-72 2xl:h-72
                        bg-green-400 rounded-full ${animation} 
                        hover:scale-110 cursor-pointer shadow-xl`}
            ></div>

            <div
              onClick={focus}
              className={`absolute lg:top-48 lg:left-[38%] xl:top-56 xl:left-[40%] 2xl:top-64 2xl:left-[42%]
                        w-60 h-60 lg:w-68 lg:h-68 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96
                        bg-blue-400 rounded-4xl ${animation} 
                        hover:scale-110 cursor-pointer shadow-xl`}
            ></div>

            <div
              onClick={focus}
              className={`absolute lg:top-52 lg:left-[28%] xl:top-60 xl:left-[30%] 2xl:top-68 2xl:left-[32%]
                        w-72 h-52 lg:w-80 lg:h-56 xl:w-85 xl:h-65 2xl:w-96 2xl:h-72
                        bg-purple-900 rounded-full ${animation} 
                        hover:scale-110 cursor-pointer shadow-xl`}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
