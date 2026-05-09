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

const TeamSetting: React.FC<TeamSettingProps> = ({ setteamSetting,IndividualTeamTask }) => {
  return (
    <>
      <div className="min-h-auto  w-full flex justify-center items-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10  pt-4  ">
        <div className="w-full  h-80 sm:min-h-96 md:h-60 lg:h-128 xl:h-144 2xl:h-180 bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-4 sm:p-6 ">
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
          <h1 className="text-green-500">{IndividualTeamTask?.Team_Name}</h1>
        </div>
      </div>
    </>
  );
};

export default TeamSetting;