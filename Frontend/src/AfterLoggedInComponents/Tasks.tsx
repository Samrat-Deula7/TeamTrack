import React, { useState, useContext, useEffect } from "react";
import Add from "../assets/add.png";
import Tick from "../assets/check-mark.png";
import Delete from "../assets/trash.png";
import OpeningB from "../assets/open-bracket.png";
import ClosingB from "../assets/close-bracket.png";
import FlowTrackContext from "../../context/FlowtrackContext";
import { type AlertType } from "../Alert";
import {
  type Data,
  type TeamData,
  type TeamTasks,
  type addTeamTask,
} from "../../context/FlowtrackState";
import Addbtn from "../assets/add.gif";
import Setting from "../assets/settings.png";
import { type IndividualTeamTaskElements } from "./TeamSetting";

type TasksProps = {
  setAddTeambtn: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  setteamSetting: React.Dispatch<React.SetStateAction<boolean>>;
  AlertPopUp: AlertType;
  AddTeambtn: boolean;
  IndividualTeamTask: IndividualTeamTaskElements;
  setTeamTasks: React.Dispatch<React.SetStateAction<TeamTasks[]>>;
  TeamTasks: TeamTasks[];
  setIndividualTeamTask: React.Dispatch<
    React.SetStateAction<IndividualTeamTaskElements>
  >;
};

const Tasks: React.FC<TasksProps> = ({
  setAlertPopUp,
  AlertPopUp,
  setAddTeambtn,
  AddTeambtn,
  setteamSetting,
  IndividualTeamTask,
  setIndividualTeamTask,
  setTeamTasks,
  TeamTasks,
}) => {
  useEffect(() => {
    getTasks();
    getTeamData();
  }, []);

  useEffect(() => {
    getTeamData();
  }, [AddTeambtn]);

  let TaskInInput = false;
  const [Task, setTask] = useState({ task: "", completed: false });
  const [TeamTask, setTeamTask] = useState({
    Team_Name: "",
    TeamTask: "",
    Completed: false,
    Team_code: "",
  });
  // const [TeamCode, setTeamCode]=useState({TeamCode:[]});
  const TeamCode: Array<number> = [];
  const [AllTasks, setAllTasks] = useState<Data[]>([]);
  const [AllTeamData, setAllTeamData] = useState<TeamData[]>([]);

  const {
    getAllTask,
    UpdateCompletedState,
    UpdateTeamTableCompleteState,
    DeleteTask,
    DeleteTeamTask,
    GetTeamData,
    GetTeamTasks,
    addTeamTask,
    joinTeamWithCode,
  } = useContext(FlowTrackContext);
  const [focused, setFocused] = useState(false);

  const uniqueTeams = AllTeamData.filter(
    (team, index, self) =>
      index === self.findIndex((t) => t.Team_Name === team.Team_Name),
  );

  // const uniqueTeamTask = TeamTasks.filter((team,index,self)=>index===self.findIndex((t)=>t.Team_Tasks != ""))
  const uniqueTeamTask = TeamTasks.filter((x) => x.Team_Tasks != "");

  const focusOnTeamData = async (
    Team_Id: number,
    Team_Name: string,
    Team_code: string,
  ) => {
    setFocused(true);
    setIndividualTeamTask({
      ...IndividualTeamTask,
      Team_Id: Team_Id,
      Team_Name: Team_Name,
      Team_code: Team_code,
    });
    let teamTasks = await GetTeamTasks(Team_code);
    setTeamTasks(teamTasks);
  };

  const getTasks = async () => {
    const dataSet: Data[] = await getAllTask();
    setAllTasks(dataSet);
  };
  const getTeamData = async () => {
    const teamDataSet: TeamData[] = await GetTeamData();
    setAllTeamData(teamDataSet);
  };

  const UpdateState = (id: any, completed: any) => {
    completed = !completed;
    UpdateCompletedState(id, completed);
    getTasks();
  };

  const UpdateTeamtableState = async (id: any, completed: any) => {
    completed = !completed;
    let updateResponse: any = await UpdateTeamTableCompleteState(id, completed);
    let teamTasks = await GetTeamTasks(IndividualTeamTask.Team_code);
    setTeamTasks(teamTasks);
    if (updateResponse[0] == 0) {
      setAlertPopUp({
        ...AlertPopUp,
        alert: true,
        type: "failure",
        msg: "You can only update the task that you created !!!",
      });

      setTimeout(() => {
        getTasks();
        setAlertPopUp({
          ...AlertPopUp,
          alert: false,
          type: "failure",
          msg: "You can only update the task that you created !!!",
        });
      }, 2000);
    }
  };

  const HandleDelete = (id: any) => {
    DeleteTask(id);
    setAlertPopUp({
      ...AlertPopUp,
      alert: true,
      type: "success",
      msg: "Task deleted successfully",
    });

    setTimeout(() => {
      getTasks();
      setAlertPopUp({
        ...AlertPopUp,
        alert: false,
        type: "success",
        msg: "Task deleted successfully",
      });
    }, 2000);
  };
  const HandleDeleteTeamData = async (id: any) => {
    let deleteResponse:any = await DeleteTeamTask(id);
    let teamTasks = await GetTeamTasks(IndividualTeamTask.Team_code);
    setTeamTasks(teamTasks);
     if (deleteResponse[0] == 0) {
      setAlertPopUp({
        ...AlertPopUp,
        alert: true,
        type: "failure",
        msg: "You can only delete the task that you created !!!",
      });

      setTimeout(() => {
        getTasks();
        setAlertPopUp({
          ...AlertPopUp,
          alert: false,
          type: "failure",
          msg: "You can only delete the task that you created !!!",
        });
      }, 2000);
    }else{
       setAlertPopUp({
         ...AlertPopUp,
         alert: true,
         type: "success",
         msg: "Task deleted successfully !!!",
       });

       setTimeout(() => {
         getTasks();
         setAlertPopUp({
           ...AlertPopUp,
           alert: false,
           type: "success",
           msg: "Task deleted successfully !!!",
         });
       }, 2000);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...Task, [e.target.name]: e.target.value });
  };

  const onTeamTaskChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamTask({
      ...TeamTask,
      Team_Name: IndividualTeamTask.Team_Name,
      [e.target.name]: e.target.value,
      Completed: false,
      Team_code: IndividualTeamTask.Team_code,
    });
  };

  const joinWithCode = async () => {
    let CodeInput = document.getElementsByClassName(
      "CodeInput",
    ) as HTMLCollectionOf<HTMLInputElement>;

    let CodeInputArray = Array.from(CodeInput);
    CodeInputArray.map((code: any) => TeamCode.push(parseInt(code.value)));
    console.log(JSON.stringify(TeamCode));
    let data: any = await joinTeamWithCode(JSON.stringify(TeamCode));
    getTeamData();
    if (data.success) {
      setAlertPopUp({
        ...AlertPopUp,
        alert: true,
        type: "success",
        msg: data.success,
      });

      setTimeout(() => {
        getTasks();
        setAlertPopUp({
          ...AlertPopUp,
          alert: false,
          type: "success",
          msg: data.success,
        });
      }, 2000);
    } else {
      setAlertPopUp({
        ...AlertPopUp,
        alert: true,
        type: "failure",
        msg: data.fail,
      });

      setTimeout(() => {
        getTasks();
        setAlertPopUp({
          ...AlertPopUp,
          alert: false,
          type: "failure",
          msg: data.fail,
        });
      }, 2000);
      CodeInputArray.map((input: any) => (input.value = ""));
    }
  };

  const AddTeamTask = async () => {
    if (TeamTask.TeamTask != "") TaskInInput = true;

    if (TaskInInput) {
      const teamtask = await addTeamTask(TeamTask as addTeamTask);
      let data = await GetTeamTasks(IndividualTeamTask.Team_code);
      setTeamTasks(data);
      if (teamtask != "") {
        setAlertPopUp({
          ...AlertPopUp,
          alert: true,
          type: "success",
          msg: teamtask,
        });

        setTimeout(() => {
          getTasks();
          setAlertPopUp({
            ...AlertPopUp,
            alert: false,
            type: "success",
            msg: teamtask,
          });
        }, 2000);
        setTeamTask({
          Team_Name: "",
          TeamTask: "",
          Completed: false,
          Team_code: "",
        });
      } else {
        setAlertPopUp({
          ...AlertPopUp,
          alert: true,
          type: "failure",
          msg: teamtask,
        });

        setTimeout(() => {
          getTasks();
          setAlertPopUp({
            ...AlertPopUp,
            alert: false,
            type: "failure",
            msg: teamtask,
          });
        }, 2000);
        setTeamTask({
          Team_Name: "",
          TeamTask: "",
          Completed: false,
          Team_code: "",
        });
      }
    }
  };
  const addTask = async () => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = "http://localhost:3000/api/tasks/CreateTask";
    if (Task.task != "") TaskInInput = true;
    if (TaskInInput) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            FlowTrackAuthtoken: FlowTrackAuthtoken || "",
          },
          body: JSON.stringify({
            Task: Task.task,
            Completed: Task.completed,
          }),
        });
        const result = await response.json();
        if (result.success) {
          setTask({ task: "", completed: false });

          setAlertPopUp({
            ...AlertPopUp,
            alert: true,
            type: "success",
            msg: result.success,
          });

          setTimeout(() => {
            getTasks();
            setAlertPopUp({
              ...AlertPopUp,
              alert: false,
              type: "success",
              msg: result.success,
            });
          }, 2000);
        }
      } catch (error: any) {
        setAlertPopUp({
          ...AlertPopUp,
          alert: true,
          type: "failure",
          msg: error.message,
        });

        setTimeout(() => {
          setAlertPopUp({ ...AlertPopUp, alert: false });
        }, 2000);
      }
    } else {
      setAlertPopUp({
        ...AlertPopUp,
        alert: true,
        type: "failure",
        msg: "Enter a task before adding it",
      });

      setTimeout(() => {
        setAlertPopUp({ ...AlertPopUp, alert: false });
      }, 2000);
    }
  };

  return (
    <>
      <div className="min-h-auto  w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10  pt-4  ">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-380` mx-auto">
          {/* Tasks Section */}
          <div className="w-full lg:flex-1 lg:max-w-1xl xl:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl text-white mb-6 sm:mb-8 font-semibold">
              Your Tasks
            </h1>

            {/* Add Task Input */}
            <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
              <input
                id="TaskInput"
                type="text"
                value={Task.task}
                name="task"
                onChange={onChange}
                // onKeyPress={handleKeyPress}
                placeholder="Add new task"
                className="flex-1 px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-gray-500 placeholder-gray-400 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none bg-transparent transition-colors"
              />
              <button
                onClick={addTask}
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 cursor-pointer bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all duration-200 shrink-0 shadow-md hover:shadow-lg${TaskInInput ? "" : "cursor-not-allowed"}`}
              >
                <img
                  src={Add}
                  alt="add"
                  className="bg-white rounded-full w-full h-full p-1.5 sm:p-2 "
                />
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-20rem)] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-scroll">
              {AllTasks.map((Task: Data) => (
                <div
                  key={Task.Task_Id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <button
                    onClick={() => UpdateState(Task.Task_Id, Task.Completed)}
                    className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2  cursor-pointer border-gray-400 rounded flex items-center justify-center hover:bg-gray-50 hover:border-gray-500 transition-all duration-200"
                  >
                    {Task.Completed && (
                      <img
                        src={Tick}
                        alt="tick"
                        className="bg-white rounded-full w-full h-full p-0.5 cursor-pointer"
                      />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm sm:text-base md:text-lg wrap-break-word leading-relaxed ${
                      Task.Completed
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {Task.Task}
                  </span>

                  <button
                    onClick={() => HandleDelete(Task.Task_Id)}
                    className="shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200  cursor-pointer"
                  >
                    <img
                      src={Delete}
                      alt="delete"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7  cursor-pointer"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-96 xl:w-140 2xl:w-172  h-80 sm:min-h-96 md:h-60 lg:h-128 xl:h-144 2xl:h-180 bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-4 sm:p-6 ">
            <h1 className="text-center font-bold text-white  text-2xl ">
              Your Teams
            </h1>
            <br />
            <div className="flex justify-around items-center bg-white rounded-full shadow-lg px-3 sm:px-4 py-2 w-full mt-2 mb-10">
              <h2 className="mr-3 font-medium">Code: </h2>

              <div className="flex outline-none text-gray-700  text-sm sm:text-base min-w-0 space-x-1">
                <div className="flex items-center">
                  <img src={OpeningB} alt="" className="h-6" />
                  <input
                    type="text"
                    id="TeamCode"
                    className=" w-8 font-bold text-xl CodeInput"
                  />
                  <p className="font-bold">|</p>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="TeamCode"
                    className=" w-8 font-bold text-xl CodeInput"
                  />
                  <p className="font-bold">|</p>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="TeamCode"
                    className=" w-8 font-bold text-xl CodeInput"
                  />
                  <p className="font-bold">|</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="TeamCode"
                    className=" w-8 font-bold text-xl CodeInput"
                  />
                  <img src={ClosingB} alt="" className="h-6" />
                </div>
              </div>
              <button
                // onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 lg:px-6 py-2 rounded-full ml-2 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base whitespace-nowrap"
                // onClick={onJoinTeamChanged}
                onClick={joinWithCode}
              >
                Join
              </button>
              <img
                src={Addbtn}
                alt="add team"
                className="w-16 cursor-pointer"
                onClick={() => {
                  setAddTeambtn(true);
                }}
              />
            </div>
            {/* Add your content here */}
            {/* Task List */}
            <div className="space-y-3 sm:space-y-4 max-h-[60%] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-scroll ">
              {uniqueTeams.map((Task: TeamData) => (
                <div
                  key={Task.Team_Id}
                  className="flex flex-col w-full h-auto items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md  duration-300 hover:border-none hover:bg-transparent cursor-pointer"
                  onClick={() => {
                    focusOnTeamData(
                      Task.Team_Id,
                      Task.Team_Name,
                      Task.Team_code,
                    );
                    setFocused(true);
                  }}
                >
                  <div className="flex w-full h-auto justify-around  items-center">
                    <h2 className="text-black font-medium">
                      Team:
                      <span className="font-bold text-green-500">
                        {"\n" + Task.Team_Name}
                      </span>
                    </h2>
                    <h3 className="text-black font-medium">
                      Code:
                      <span className="font-bold text-green-500">
                        {"\n" + Task.Team_code}
                      </span>
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            {/* This is the team tasks */}
            <div
              id="teamTasks"
              className={` bg-[#101820] backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-4 sm:p-6 scale-0 transition pointer-events-auto 
          ${focused ? "absolute inset-0 z-1000 scale-100 pointer-events-auto" : "min-h-80 sm:min-h-96 md:min-h-60 lg:min-h-128 xl:min-h-144"}`}
            >
              <button
                onClick={() => {
                  setFocused(false);
                }}
                className="absolute top-4 right-6 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
                aria-label="Close button"
              >
                &times;
              </button>
              <div className=" h-full ">
                <div className="w-[90%] flex justify-between items-start">
                  <h2 className="font-bold text-green-500 mb-4">
                    {IndividualTeamTask.Team_Name.toUpperCase()}
                  </h2>
                  <img
                    src={Setting}
                    alt="setting"
                    className="w-5 cursor-pointer"
                    onClick={() => setteamSetting(true)}
                  />
                </div>
                {/* Input for adding team task */}
                <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <input
                    id="TaskInput"
                    type="text"
                    value={TeamTask.TeamTask}
                    name="TeamTask"
                    onChange={onTeamTaskChanged}
                    placeholder="Add new task"
                    className="flex-1 px-3 sm:px-4 md:px-5 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-gray-500 placeholder-gray-400 border-b-2 border-gray-300 focus:border-gray-400 focus:outline-none bg-transparent transition-colors"
                  />
                  <button
                    onClick={AddTeamTask}
                    className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 cursor-pointer bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all duration-200 shrink-0 shadow-md hover:shadow-lg${TaskInInput ? "" : "cursor-not-allowed"}`}
                  >
                    <img
                      src={Add}
                      alt="add"
                      className="bg-white rounded-full w-full h-full p-1.5 sm:p-2 "
                    />
                  </button>
                </div>

                {/* team tasks */}
                <div className=" h-[80%] overflow-y-scroll space-y-3 sm:space-y-4">
                  {uniqueTeamTask.map((tasks: TeamTasks) => (
                    <div
                      key={tasks.Team_Id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 "
                    >
                      <button
                        onClick={() => {
                          UpdateTeamtableState(tasks.Team_Id, tasks.Completed);
                        }}
                        className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2  cursor-pointer border-gray-400 rounded flex items-center justify-center hover:bg-gray-50 hover:border-gray-500 transition-all duration-200"
                      >
                        {tasks.Completed && (
                          <img
                            src={Tick}
                            alt="tick"
                            className="bg-white rounded-full w-full h-full p-0.5 cursor-pointer"
                          />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm sm:text-base md:text-lg wrap-break-word leading-relaxed ${
                          tasks.Completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {tasks.Name}
                      </span>
                      <span
                        className={`flex-1 text-sm sm:text-base md:text-lg wrap-break-word leading-relaxed ${
                          tasks.Completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {tasks.Team_Tasks}
                      </span>

                      <button
                        onClick={() => HandleDeleteTeamData(tasks.Team_Id)}
                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200  cursor-pointer"
                      >
                        <img
                          src={Delete}
                          alt="delete"
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7  cursor-pointer"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
