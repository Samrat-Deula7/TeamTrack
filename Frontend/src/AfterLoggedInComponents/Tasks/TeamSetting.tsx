import type React from "react";
import { type TeamTasks } from "../../../context/FlowtrackState";
import user from "../../assets/user.png";
import FlowTrackContext from "../../../context/FlowtrackContext";
import { useContext, useState } from "react";
import { type AlertType } from "../../Alert";

export type IndividualTeamTaskElements = {
  Team_Id: number;
  Team_Name: string;
  Team_code: string;
};
type TeamSettingProps = {
  setteamSetting: React.Dispatch<React.SetStateAction<boolean>>;
  IndividualTeamTask: IndividualTeamTaskElements;
  setTeamTasks: React.Dispatch<React.SetStateAction<TeamTasks[]>>;
  TeamTasks: TeamTasks[];
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  AlertPopUp: AlertType;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const handleTabClick = (targetClass: string) => {
  const allTabs = document.querySelectorAll(".tab-content");
  allTabs.forEach((tab) => tab.classList.remove("scalefull"));

  document.querySelector(`.${targetClass}`)?.classList.add("scalefull");
};

type DelPops = "delete" | "leave" | "";

const TeamSetting: React.FC<TeamSettingProps> = ({
  setteamSetting,
  IndividualTeamTask,
  setTeamTasks,
  TeamTasks,
  setAlertPopUp,
  AlertPopUp,
  setLoading,
}) => {
  const {
    addUserToTeam,
    GetTeamTasks,
    LeaveTeam,
    DeleteTeam,
    UpdateTeamTableUserType,
  } = useContext(FlowTrackContext);
  const [Error, setError] = useState("");
  const [AddedUserEmail, setAddedUserEmail] = useState("");
  const [DelChangeValue, setDelChangeValue] = useState<DelPops>("");

  const onchange = (e: any) => {
    setAddedUserEmail(e.target.value);
    setError("");
  };
  const onDelChange = (e: any) => {
    setDelChangeValue(e.target.value);
  };

  const showSuccess = (message: string) => {
    setAlertPopUp({
      ...AlertPopUp,
      alert: true,
      type: "success",
      msg: message,
    });

    setTimeout(() => {
      setAlertPopUp({
        ...AlertPopUp,
        alert: false,
        type: "success",
        msg: message,
      });
    }, 2000);
  };

  const showFailure = (message: string) => {
    setAlertPopUp({
      ...AlertPopUp,
      alert: true,
      type: "failure",
      msg: message,
    });

    setTimeout(() => {
      setAlertPopUp({
        ...AlertPopUp,
        alert: false,
        type: "failure",
        msg: message,
      });
    }, 2000);
  };

  const handleUpdateType = async (UserId: number, SetType: string) => {
    setLoading(true)
    const UpdateRes: any = await UpdateTeamTableUserType(
      UserId,
      IndividualTeamTask.Team_code,
      SetType,
    );
    if (UpdateRes == -1) {
          setLoading(false);
      showFailure("Atleast 1 User need to be admin");
      setDelChangeValue("");
      setteamSetting(false);
    } else if (UpdateRes > 0) {
                setLoading(false);

      showSuccess("Updated Successfully!");
      setDelChangeValue("");
      setteamSetting(false);
    } else {
                setLoading(false);

      showFailure("Only Admin can pormote to Admin");
      setDelChangeValue("");
      setteamSetting(false);
    }
  };

  const handleDel = async (e: any) => {
    e.preventDefault();
    if (DelChangeValue.toLowerCase() == "leave") {
      setLoading(true);
      const levApiRes: any = await LeaveTeam(IndividualTeamTask.Team_code);
      if (levApiRes > 0) {
        setLoading(false);
        showSuccess("Team Leaved !!");
        setDelChangeValue("");
        setteamSetting(false);
      } else if (levApiRes == -1) {
        setLoading(false);
        showFailure("Your are the only Admin so you can't leave !!");
        setteamSetting(false);
      } else {
        setLoading(false);
        showFailure("Unable to leave Team");
        setteamSetting(false);
      }
    } else {
      setLoading(true);
      const delApiRes: any = await DeleteTeam(IndividualTeamTask.Team_code);
      if (delApiRes > 0) {
        setLoading(false);
        showSuccess("Team Deleted!!");
        setDelChangeValue("");
        setteamSetting(false);
      } else {
        setLoading(false);
        showFailure("Only Admin is authorized to delete the team !!");
        setDelChangeValue("");
        setteamSetting(false);
      }
    }
  };
  const handleAdd = async () => {
    setLoading(true);
    const apiRes: any = await addUserToTeam(
      AddedUserEmail,
      IndividualTeamTask.Team_Name,
      IndividualTeamTask.Team_code,
    );
    if (apiRes.success) {
      setLoading(false);
      setAddedUserEmail("");
      let teamTasks = await GetTeamTasks(IndividualTeamTask.Team_code);
      setTeamTasks(teamTasks);
      showSuccess(apiRes.success);
    } else {
      setLoading(false);
      setError(apiRes.error);
    }
  };

  const TeamTaskFilter = TeamTasks.filter(
    (team, index, self) =>
      index === self.findIndex((t) => t.name === team.name),
  );

  return (
    <>
      <div className="min-h-auto  w-full flex justify-center items-center px-1 xl:px-10  pt-4  ">
        <div className="w-full h-170 sm:min-h-96 md:h-140 lg:h-128 xl:h-154 2xl:h-200 rounded-xl border border-white/10 p-4 sm:p-4 ">
          <button
            onClick={() => {
              setteamSetting(false);
            }}
            className="absolute top-20 right-5 xl:top-30 xl:right-16 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
            aria-label="Close button"
          >
            &times;
          </button>
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

          <div className="flex flex-col xl:flex-row  w-full h-80 sm:min-h-96 md:h-60 lg:h-128 xl:h-144 2xl:h-180 px-0.1">
            {/* This is the button div */}
            <div className="flex 2xl:flex-col justify-start items-start w-auto  gap-2 sm:gap-3 md:gap-4  p-1 ">
              <button
                className=" text-sm sm:text-base text-gray-400 md:text-lg lg:text-6 w-auto px-6 font-semibold  rounded-sm border border-transparent hover:border-white/20 hover:bg-green-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("addUser")}
              >
                Add Member
              </button>
              <button
                className=" text-sm sm:text-base md:text-lg lg:text-6 w-auto px-6 font-semibold text-gray-400 rounded-sm border border-transparent hover:border-white/20 hover:bg-red-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("leaveTeam")}
              >
                Leave Team
              </button>
              <button
                className=" text-sm sm:text-base md:text-lg lg:text-6 w-auto px-6 font-semibold text-gray-400 rounded-sm border border-transparent hover:border-white/20 hover:bg-red-500 hover:text-white transition-all duration-300  cursor-pointer active:scale-95"
                onClick={() => handleTabClick("deleteTeam")}
              >
                Delete Team
              </button>
            </div>
            <div className="hidden xl:block w-1 sm:min-h-76 md:h-40 lg:h-108 xl:h-124 2xl:h-160 my-auto bg-white rounded-full "></div>

            {/* This is the side div */}
            <div className="relative w-full lg:flex">
              <div className="absolute inset-0 addUser  duration-50  z-50  text-white text-2xl  font-bold px-5">
                {/* This is input */}
                <p className="text-red-500 text-center font-medium text-sm xl:text-xl">
                  {Error}
                </p>
                <div className="flex items-center bg-white rounded-full shadow-lg px-3 sm:px-4 py-2 xl:w-xl mx-auto mt-2">
                  <input
                    type="text"
                    placeholder="Add member with email ...."
                    value={AddedUserEmail}
                    onChange={onchange}
                    // onKeyPress={handleKeyPress}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base min-w-0"
                  />
                  <button
                    onClick={handleAdd}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 lg:px-6 py-2 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base whitespace-nowrap"
                  >
                    Add Member
                  </button>
                </div>
                <br />
                <h1 className="mb-2">Team Members :</h1>
                {TeamTaskFilter.map((task: TeamTasks) => (
                  <div className="flex items-center" key={task.team_id}>
                    <img src={user} alt="user" className="w-6 mr-2" />
                    <div className="flex justify-center items-center text-2 font-normal text-green-500">
                      {" "}
                      {task.name}{" "}
                      <span
                        className={`ml-2 text-sm font-medium ${task.type == "admin" ? "text-green-500" : "text-gray-500"}`}
                      >
                        ({task.type})
                      </span>
                      <button
                        className={`bg-green-500 hover:bg-green-600 text-white px-1.25 py-1 rounded-full ml-2 transition-colors cursor-pointer font-medium text-xs whitespace-nowrap ${task.type == "member" ? "block" : "hidden"}`}
                        onClick={() =>
                          handleUpdateType(task.user_id, task.type)
                        }
                      >
                        Update to admin ?
                      </button>
                      <button
                        className={`bg-green-500 hover:bg-green-600 text-white px-1.25 py-1 rounded-full ml-2 transition-colors cursor-pointer font-medium text-xs whitespace-nowrap ${task.type == "admin" ? "block" : "hidden"}`}
                        onClick={() =>
                          handleUpdateType(task.user_id, task.type)
                        }
                      >
                        Demote to member ?
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 scalenone leaveTeam tab-content z-50 flex  justify-center bg-[#101820] text-white text-xl font-bold">
                <div className="relative xl:top-50 w-full bg-[#101820] xl:w-[350px] h-[100px] xl:h-[120px] text-center  rounded-2xl py-3 px-2 border-5 border-red-500">
                  <p className="mb-2  text-sm xl:text-xl">
                    Write "LEAVE" to leave the team
                  </p>
                  <div className="flex items-center justify-around">
                    <form onSubmit={handleDel}>
                      <input
                        type="text"
                        placeholder="..."
                        name="input"
                        onChange={onDelChange}
                        className="w-[200px]  mr-1 font-medium bg-black border border-white/10 rounded-full  rounded px-2 py-1  text-white transition focus:outline-none focus:border-red-500 focus:bg-[#020617CC]"
                      />
                    </form>
                    <button
                      onClick={() => handleTabClick("addUser")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 lg:px-6 py-2 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 scalenone deleteTeam tab-content z-50 flex items-center justify-center bg-[#101820] text-white text-xl font-bold">
                <div className="relative top-12 xl:-top-26 w-[490px] bg-[#101820] xl:w-[380px] h-[100px] xl:h-[120px] text-center  rounded-2xl py-3 px-2 border-5 border-red-500">
                  <p className="mb-2 text-sm xl:text-xl">
                    Write "DELETE" to DELETE team
                  </p>
                  <div className="flex items-center justify-around">
                    <form onSubmit={handleDel}>
                      <input
                        type="text"
                        placeholder="..."
                        name="input"
                        onChange={onDelChange}
                        className="w-[200px]  mr-1 font-medium bg-black border border-white/10 rounded-full  rounded px-2 py-1  text-white transition focus:outline-none focus:border-red-500 focus:bg-[#020617CC]"
                      />
                    </form>
                    <button
                      onClick={() => handleTabClick("addUser")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 lg:px-6 py-2 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 scalenone demoteUser tab-content z-50 flex items-center justify-center bg-[#101820] text-white text-xl font-bold">
                <div className="relative top-12 xl:-top-26 w-[490px] bg-[#101820] xl:w-[380px] h-[100px] xl:h-[120px] text-center  rounded-2xl py-3 px-2 border-5 border-red-500">
                  <p className="mb-2 text-sm xl:text-xl">
                    Write "DELETE" to DELETE team
                  </p>
                  <div className="flex items-center justify-around">
                    <form onSubmit={handleDel}>
                      <input
                        type="text"
                        placeholder="..."
                        name="input"
                        onChange={onDelChange}
                        className="w-[200px]  mr-1 font-medium bg-black border border-white/10 rounded-full  rounded px-2 py-1  text-white transition focus:outline-none focus:border-red-500 focus:bg-[#020617CC]"
                      />
                    </form>
                    <button
                      onClick={() => handleTabClick("addUser")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 lg:px-6 py-2 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSetting;
