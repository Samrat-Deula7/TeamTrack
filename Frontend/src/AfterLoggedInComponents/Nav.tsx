import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import Alert ,{ type AlertType } from "../Alert";
import Loading from "../Loading";

type NavProps = {
  setLoggedin?: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  AlertPopUp: AlertType;
  setmenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  loading:boolean;
};

const NavBar: React.FC<NavProps> = ({
  setLoggedin,
  setAlertPopUp,
  AlertPopUp,
  setmenuOpen,
  menuOpen,
  loading,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <Alert AlertPopUp={AlertPopUp} setAlertPopUp={setAlertPopUp} />
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? " backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className=" w-full h-15 flex justify-between items-center px-3">
          <div className="flex justify-center items-center  gap-2 text-xl ">
            <img src={Logo} alt="logo" className="w-7" />
            <h1 className="text-white font-bold">
              <div className="flex">
                <Link to="/">
                  Team<span className="text-green-500">Track</span>
                </Link>
              </div>
            </h1>
          </div>

          <button
            className="text-[#000000] font-bold text-[13px] border border-2 border-green-500 text-green-500 w-30 h-7 rounded-xl duration-300 hover:border-none hover:bg-transparent cursor-pointer"
            onClick={() => {
              setAlertPopUp({
                ...AlertPopUp,
                alert: true,
                type: "success",
                msg: "Logged out Successfully",
              });

              setTimeout(() => {
                setLoggedin?.(false);
                localStorage.removeItem("FlowTrackToken");
                setAlertPopUp({
                  ...AlertPopUp,
                  alert: false,
                  type: "success",
                  msg: "Logged out Successfully",
                });
              }, 2000);
            }}
          >
            Logged Out
          </button>
          {/* This is the mobile menu */}
          <div
            className=" w-7 h-5  relative -left-4 cursor-pointer z-40 text-white md:hidden"
            onClick={() => setmenuOpen((prev) => !prev)}
          >
            &#9776;
          </div>
        </div>
        <div
          className={`md:flex w-3xl h-xl  justify-start items-center gap-x-2 py-1 px-2 ${
            menuOpen
              ? "flex w-screen h-screen absolute top-0 right-0 z-1000 bg-[#000000F2]"
              : "hidden"
          }`}
        >
          <div
            className={`flex items-center gap-x-5 px-3 ${menuOpen ? "flex-col justify-center h-screen w-screen space-y-2 text-2xl" : ""}`}
          >
            <button
              onClick={() => {
                setmenuOpen(false);
              }}
              className={`absolute top-40 right-20 text-2xl text-white font-bold lg:text-3xl  focus:outline-none cursor-pointer  ${
                menuOpen ? "flex" : "hidden"
              }`}
              aria-label="Close button"
            >
              &times;
            </button>

            <Link
              to="/tasks"
              className={` md:text-110  text-gray-400 cursor-pointer hover:text-green-500 hover:font-mono`}
              onClick={() => {
                setmenuOpen(false);
              }}
            >
              Tasks
            </Link>
            <Link
              to="/collaboration"
              className={` md:text-110  text-gray-400 cursor-pointer hover:text-green-500 hover:font-mono`}
              onClick={() => {
                setmenuOpen(false);
              }}
            >
              Collaboration
            </Link>
            <Link
              to="/visualization"
              className={` md:text-110  text-gray-400 cursor-pointer hover:text-green-500 hover:font-mono`}
              onClick={() => {
                setmenuOpen(false);
              }}
            >
              Visualization
            </Link>
            <Link
              to="/history"
              className={` md:text-110 text-gray-400 cursor-pointer hover:text-green-500 hover:font-mono`}
              onClick={() => {
                setmenuOpen(false);
              }}
            >
              History
            </Link>
            <Link
              to="/iteration"
              className={` md:text-110  text-gray-400 cursor-pointer hover:text-green-500 hover:font-mono`}
              onClick={() => {
                setmenuOpen(false);
              }}
            >
              Iteration
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
