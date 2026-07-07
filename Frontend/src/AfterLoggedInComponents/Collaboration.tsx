import React, { useState, useEffect, useContext } from "react";
import { type TeamData } from "../../context/FlowtrackState";
import FlowTrackContext from "../../context/FlowtrackContext";
import Search from "../assets/search.png";
import Add from "../assets/add.gif";
import arrow from "../assets/arrow.png";
import plus from "../assets/plus.png";
import addEmoji from "../assets/smile-plus.png";
import mic from "../assets/microphone.png";
import Time from "../assets/time.gif";

type CollaborationType = {
  setAddTeambtn: React.Dispatch<React.SetStateAction<boolean>>;
  setAllTeamData: React.Dispatch<React.SetStateAction<TeamData[]>>;
  AllTeamData: TeamData[];
};

const Collaboration: React.FC<CollaborationType> = ({
  setAddTeambtn,
  setAllTeamData,
  AllTeamData,
}) => {
  const { GetTeamData } = useContext(FlowTrackContext);
  const getTeamData = async () => {
    const teamDataSet: TeamData[] = await GetTeamData();
    setAllTeamData(teamDataSet);
  };
  useEffect(() => {
    getTeamData();
  }, [AllTeamData]);
  //  const [searchQuery, setSearchQuery] = useState("");
  //  const handleSearch = () => {
  //    if (searchQuery.trim()) {
  //      console.log("Searching for:", searchQuery);
  //      // Add your search logic here
  //    }
  //  };
  //  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //    if (e.key === "Enter") {
  //      handleSearch();
  //    }
  //  };
  const [ChatDiv, setChatDiv] = useState({ on: false, team: "" });
  const uniqueTeams = AllTeamData.filter(
    (team, index, self) =>
      index === self.findIndex((t) => t.team_name === team.team_name),
  );
  const handleSend = async (e: any) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        {/* Left Panel - Search Section */}
        <div
          className={`lg:flex flex-col space-y-8 justify-start items-center w-full  lg:w-[25%] h-screen  lg:h-[500px] xl:h-[600px] 2xl:h-[800px]  bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-4 sm:p-6 ${ChatDiv ? "hidden" : "flex"}`}
        >
          {/* Input Bar */}
          <div className="flex items-center bg-white rounded-full shadow-lg h-14 px-2 py-2 w-full mt-2">
            <img
              src={Search}
              alt="search"
              className="w-3 h-3 sm:w-4 sm:h-4  shrink-0 mr-1"
            />
            <input
              type="text"
              placeholder="Search Team"
              //  value={searchQuery}
              //  onChange={(e) => setSearchQuery(e.target.value)}
              //  onKeyPress={handleKeyPress}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-base min-w-0"
            />
            <button
              //  onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm  whitespace-nowrap"
            >
              Search
            </button>
            <img
              src={Add}
              alt="add team"
              className="w-12 cursor-pointer rounded-full lg:hidden 2xl:flex"
              onClick={() => setAddTeambtn(true)}
            />
          </div>

          {/* Teams */}
          <div className="space-y-3 sm:space-y-4  h-screen  lg:h-[500px] xl:h-[600px] 2xl:h-[800px] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-auto ">
            {uniqueTeams.map((Task: TeamData) => (
              <div
                key={Task.team_id}
                className="flex flex-col w-auto h-auto items-center gap-3 sm:gap-4 p-3  bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md  duration-300  hover:bg-transparent cursor-pointer"
                //  onClick={() => {
                //    focusOnTeamData(
                //      Task.Team_Id,
                //      Task.Team_Name,
                //      Task.Team_code,
                //    );
                //    setFocused(true);
                //  }}
                onClick={() =>
                  setChatDiv({ ...ChatDiv, on: true, team: Task.team_name })
                }
              >
                <div className="flex w-full h-auto justify-around  items-center justify-between">
                  <h2 className="text-black font-medium text-xs mr-2">
                    Team:
                    <span className="font-bold text-xs text-green-500">
                      {"\n" + Task.team_name}
                    </span>
                  </h2>
                  <h3 className="text-black font-medium text-xs">
                    Code:
                    <span className="font-bold text-xs text-green-500">
                      {"\n" + Task.team_code}
                    </span>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Content Section - Hidden on mobile and tablet, visible on laptop+ */}
        <div
          className={`lg:flex items-center justify-center w-full h-[500px] xl:h-[600px] 2xl:h-[800px] bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${ChatDiv.on ? "flex" : "hidden"}`}
        >
          {/* This is the top bar */}
          <div className="w-full  px-3 py-2 bg-transparent backdrop-blur-md shadow-lg absolute top-0 rounded-t-xl">
            <span className="font-bold text-xs md:text-xl text-green-500">
              {ChatDiv.team}
            </span>
          </div>

          {/* This is the messing left and right block */}

          <div className="w-full h-[400px] xl:h-[500px] 2xl:h-[700px] flex flex-col justify-end">
            {/* This is the left message block */}
            <div className="w-full  flex justify-start items-end">
              <div className="flex flex-col">
                {/* This is each message */}
                <div className="flex m-0.5">
                  <div className="w-0 h-0   border-l-[5px] border-l-transparent  border-r-[5px] border-r-transparent border-t-[10px] transform rotate-90 -translate-x-0 translate-y-1 border-white "></div>
                  <div className="bg-white max-w-xl w-auto h-auto wrap-break-word z-1 px-3 py-2 h-10 rounded-sm font-medium">
                    Left Message
                  </div>
                </div>
              </div>
            </div>

            {/* This is the right message block */}
            <div className="w-full  flex justify-end items-end">
              <div className="flex flex-col">
                {/* This is each message */}

                <div className="flex m-0.5">
                  <div className="bg-white max-w-xl w-auto h-auto wrap-break-word z-1 px-3 py-2 h-10 rounded-sm font-medium">
                    Right Message
                  </div>
                  <div className="w-0 h-0   border-l-[5px] border-l-transparent  border-r-[5px] border-r-transparent border-t-[10px] transform -rotate-90 -translate-x-0 translate-y-1 border-white "></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setChatDiv({ ...ChatDiv, on: false, team: "" });
            }}
            className="flex lg:hidden absolute top-2 left-2 xl:top-30 xl:right-16 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
            aria-label="Close button"
          >
            <img src={arrow} alt="back" className="w-5" />
          </button>
          <form
            onSubmit={handleSend}
            className="absolute bottom-1  flex items-center  bg-white rounded-full shadow-lg w-[95%] h-10 px-3 py-2 mt-2 mb-1 m-auto"
          >
            <img
              src={plus}
              alt="search"
              className="w-3 h-3 sm:w-4 sm:h-4  shrink-0 mr-3 cursor-pointer"
            />
            <img
              src={addEmoji}
              alt="search"
              className="w-4 h-4 sm:w-5 sm:h-5  shrink-0 mr-5 cursor-pointer"
            />

            <div className="flex items-center justify-between w-full ">
              <input
                type="text"
                placeholder="Send Message ..."
                //  value={searchQuery}
                //  onChange={(e) => setSearchQuery(e.target.value)}
                //  onKeyPress={handleKeyPress}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-base min-w-0"
              />
              <img
                src={mic}
                alt="search"
                className="w-4 h-4 sm:w-5 sm:h-5  shrink-0 cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Collaboration;
