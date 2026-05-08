import type React from "react";
import   {type IndividualTeamTaskElements}from "./Tasks"
type TeamSettingProps = {
  setteamSetting: React.Dispatch<React.SetStateAction<boolean>>;
  IndividualTeamTask?: IndividualTeamTaskElements;
  setIndividualTeamTask?: React.Dispatch<React.SetStateAction<IndividualTeamTaskElements>>;
};

const TeamSetting: React.FC<TeamSettingProps> = ({ setteamSetting,IndividualTeamTask,setIndividualTeamTask }) => {
  return (
    <>
      <div className="w-full lg:w-96 xl:w-140 2xl:w-172  h-80 sm:min-h-96 md:h-60 lg:h-128 xl:h-144 2xl:h-180 bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-4 sm:p-6 ">
        {/* Cant put onClick={onComplete()} because the function will be called
        immediately so we put no braket onClick={onComplete} due to which the function is only called when the button is clicked */}
        
        <button
          onClick={() => {
           setteamSetting(false);
          }}
        >
          click me
        </button>
        <h1 className="text-green-500">{IndividualTeamTask?.Team_Name}</h1>
      </div>
    </>
  );
};

export default TeamSetting;