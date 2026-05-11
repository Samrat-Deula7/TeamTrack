import type React from "react";

export type IndividualTeamTaskElements = {
  Team_Id: number;
  Team_Name: string;
  Team_code: string;
};
type TeamSettingProps = {
  setteamSetting: React.Dispatch<React.SetStateAction<boolean>>;
  IndividualTeamTask?: IndividualTeamTaskElements;
};

const handleTabClick = (targetClass: string) => {
  const allTabs = document.querySelectorAll(".tab-content");
  allTabs.forEach((tab) => tab.classList.remove("scalefull"));

  document.querySelector(`.${targetClass}`)?.classList.add("scalefull");
};

const TeamSetting: React.FC<TeamSettingProps> = ({ setteamSetting,IndividualTeamTask }) => {
  return (
    <>
      <div className="min-h-auto  w-full flex justify-center items-center px-1 xl:px-10  pt-4  ">
        <div className="w-full h-80 sm:min-h-96 md:h-60 lg:h-128 xl:h-144 2xl:h-200 rounded-xl border border-white/10 p-4 sm:p-4 ">
          <div className="flex mb-3">
            <h1 className="font-bold mr-3 text-xl text-gray-400">
              General Setting:{" "}
            </h1>
            <h1 className="text-green-500 text-xl">
              {IndividualTeamTask?.Team_Name}
            </h1>
          </div>

          {/* Cant put onClick={onComplete()} because the function will be called
        immediately so we put no braket onClick={onComplete} due to which the function is only called when the button is clicked */}
          <button
            onClick={() => {
              setteamSetting(false);
            }}
            className="absolute top-4 right-6 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
            aria-label="Close button"
          >
            &times;
          </button>
          <div className="flex  w-full h-80 sm:min-h-96 md:h-60 lg:h-128 xl:h-144 2xl:h-180 px-0.1">
            {/* This is the button div */}
            <div className="flex lg:flex-col justify-start items-start w-auto  gap-2 sm:gap-3 md:gap-4  p-1 ">
              <button
                className=" text-sm sm:text-base text-gray-400 md:text-lg lg:text-6 w-auto px-6 font-semibold  rounded-sm border border-transparent hover:border-white/20 hover:bg-green-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("list")}
              >
                Add Member
              </button>
              <button
                className=" text-sm sm:text-base md:text-lg lg:text-6 w-auto px-6 font-semibold text-gray-400 rounded-sm border border-transparent hover:border-white/20 hover:bg-green-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("meeting")}
              >
                Leave Team
              </button>
              <button
                className=" text-sm sm:text-base md:text-lg lg:text-6 w-auto px-6 font-semibold text-gray-400 rounded-sm border border-transparent hover:border-white/20 hover:bg-green-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("graph")}
              >
                Delete Team
              </button>
            </div>
            <div className="w-1 sm:min-h-76 md:h-40 lg:h-108 xl:h-124 2xl:h-160 my-auto bg-white rounded-full "></div>
            {/* This is the side div */}
            <div className="relative w-full lg:flex-1  overflow-hidden">
              <div className="absolute inset-0  duration-300 scalenone list tab-content z-50 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                List
              </div>
              <div className="absolute inset-0  duration-300 scalenone meeting tab-content z-40 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                Meeting
              </div>
              <div className="absolute inset-0  duration-300 scalenone graph tab-content z-30 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                Graph
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSetting;