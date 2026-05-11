import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png"

type NavBarProps={
  setLoginbtn ?:React.Dispatch<React.SetStateAction<boolean>>
  setSignupbtn ?:React.Dispatch<React.SetStateAction<boolean>>
}
const NavBar: React.FC<NavBarProps> = ({ setLoginbtn, setSignupbtn }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? " backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className=" w-full h-15 flex justify-between items-center px-3">
        <div className="flex justify-center items-center gap-2 text-xl ">
          <img src={Logo} alt="logo" className="w-7" />
          <h1 className="text-white font-bold">
            <div className="flex">
              Team <span className="text-green-500">Track</span>
            </div>
          </h1>
        </div>

        <div className="w-47.5 flex justify-center  gap-2  h-15 flex justify-center items-center ">
          <button
            className="text-[#000000] font-bold text-[13px] bg-green-400 w-19 h-7 rounded-xl  duration-300 hover:text-green-500 hover:bg-transparent cursor-pointer"
            onClick={() => setLoginbtn?.((prev) => !prev)}
          >
            Sign in
          </button>
          <button
            className="text-[#000000] font-bold text-[13px] border border-2 border-green-500 text-green-500 w-19 h-7 rounded-xl  duration-300 hover:border-none hover:bg-transparent cursor-pointer"
            onClick={() => setSignupbtn?.((prev) => !prev)}
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
