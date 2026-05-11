import type React from "react";
import { type TeamTasks } from "../../context/FlowtrackState";
import user from "../assets/user.png"
import Tasks from "./Tasks";
export type IndividualTeamTaskElements = {
  Team_Id: number;
  Team_Name: string;
  Team_code: string;
};
type TeamSettingProps = {
  setteamSetting: React.Dispatch<React.SetStateAction<boolean>>;
  IndividualTeamTask?: IndividualTeamTaskElements;
   setTeamTasks: React.Dispatch<React.SetStateAction<TeamTasks[]>>;
    TeamTasks: TeamTasks[];
};

const handleTabClick = (targetClass: string) => {
  const allTabs = document.querySelectorAll(".tab-content");
  allTabs.forEach((tab) => tab.classList.remove("scalefull"));

  document.querySelector(`.${targetClass}`)?.classList.add("scalefull");
};

const TeamSetting: React.FC<TeamSettingProps> = ({
  setteamSetting,
  IndividualTeamTask,
  setTeamTasks,
  TeamTasks,
}) => {
  const TeamTaskFilter1 = TeamTasks.filter((x) => x.Team_Tasks != "");
   const TeamTaskFilter2 = TeamTaskFilter1.filter(
     (team, index, self) =>
       index === self.findIndex((t) => t.Name === team.Name),
   );
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
            className="absolute top-30 right-16 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
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
                className=" text-sm sm:text-base md:text-lg lg:text-6 w-auto px-6 font-semibold text-gray-400 rounded-sm border border-transparent hover:border-white/20 hover:bg-red-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("meeting")}
              >
                Leave Team
              </button>
              <button
                className=" text-sm sm:text-base md:text-lg lg:text-6 w-auto px-6 font-semibold text-gray-400 rounded-sm border border-transparent hover:border-white/20 hover:bg-red-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("graph")}
              >
                Delete Team
              </button>
            </div>
            <div className="w-1 sm:min-h-76 md:h-40 lg:h-108 xl:h-124 2xl:h-160 my-auto bg-white rounded-full "></div>
            {/* This is the side div */}
            <div className="relative w-full lg:flex-1  overflow-hidden">
              <div className="absolute inset-0  duration-50  z-50  text-white text-2xl  font-bold px-5">
                {/* This is input */}
                <div className="flex items-center bg-white rounded-full shadow-lg px-3 sm:px-4 py-2 w-xl mx-auto mt-2">
                  <input
                    type="text"
                    placeholder="Add member ...."
                    // value={searchQuery}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                    // onKeyPress={handleKeyPress}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base min-w-0"
                  />
                  <button
                    // onClick={handleSearch}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 lg:px-6 py-2 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base whitespace-nowrap"
                  >
                    Add Member
                  </button>
                </div>
                <br />
                <h1 className="mb-2">Team Members :</h1>
                {TeamTaskFilter2.map((task: TeamTasks) => (
                  <div className="flex items-center" key={task.Team_Id}>
                    <img src={user} alt="user" className="w-6 mr-2" />
                    <span className="text-2 font-normal text-green-500">
                      {" "}
                      {task.Name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 duration-50 scalenone meeting tab-content z-50 flex items-center justify-center bg-red-500 text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                Leave Team
              </div>
              <div className="absolute inset-0 duration-50 scalenone graph tab-content z-50 flex items-center justify-center bg-yellow-500 text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                Delete Team
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSetting;