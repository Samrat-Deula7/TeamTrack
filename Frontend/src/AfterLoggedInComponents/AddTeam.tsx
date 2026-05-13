import React, { useState,useContext } from "react";
import { type AlertType } from "../Alert";
import {type TeamData} from "../../context/FlowtrackState"
import FlowTrackContext from "../../context/FlowtrackContext"

type SignupPorps = {
  setAddTeambtn: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  AddTeambtn: boolean;
  AlertPopUp: AlertType;
  AllTeamData?: TeamData[];
  setAllTeamData?: React.Dispatch<React.SetStateAction<TeamData[]>>;
};

const AddTeam: React.FC<SignupPorps> = ({
  setAddTeambtn,
  setAlertPopUp,
  AlertPopUp,
  AddTeambtn,
  AllTeamData,
  setAllTeamData,
}) => {
  const {
   
    GetTeamData,
    
  } = useContext(FlowTrackContext);
  const [validationError, setValidationError] = useState({
    Team_Name: "",
    Team_Tasks: "",
    Completed: "",
    userExistsError: "",
  });
  const [credentials, setCredentials] = useState({
    Team_Name: "",
    Team_Tasks: "",
    Completed: "",
  });

  const onChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const preventDefault = async (e: any) => {
    e.preventDefault();
  };

  const createUser = async () => {
    try {
      // API Call
      const url = "http://localhost:3000/api/teamtasks/createTeam";
      const { Team_Name, Team_Tasks, Completed } = credentials;
      const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({
          Team_Name,
          Team_Tasks,
          Completed,
        }),
      });
      const result = await response.json();
      if (result[0].success) {
        // Save the auth token and redirect
        setCredentials({
          Team_Name: "",
          Team_Tasks: "",
          Completed: "",
        });
        setValidationError({
          Team_Name: "",
          Team_Tasks: "",
          Completed: "",
          userExistsError: "",
        });
        setAlertPopUp({
          ...AlertPopUp,
          alert: true,
          type: "success",
          msg: result[0].success + "Code= " + result[1].Code,
        });
        const teamDataSet: TeamData[] = await GetTeamData();
            setAllTeamData?.(teamDataSet);
        setAddTeambtn(false);
        setTimeout(() => {
          // I am still setting the type and msg because if i dont then for a sec the alert show failure.
          setAlertPopUp({
            ...AlertPopUp,
            alert: false,
            type: "success",
            msg: result[0].success + "Code= " + result[1].Code,
          });
        }, 3000);
      } else {
        if (result.error) {
          const alreadyExistsError = result.error;
          setValidationError({
            Team_Name: "",
            Team_Tasks: "",
            Completed: "",
            userExistsError: alreadyExistsError,
          });
        } else {
          const getErrorMessage = (field: string) => {
            const error = result.errors.find((e: any) => e.path === field);
            return error?.msg || null;
          };
          setValidationError({
            Team_Name: getErrorMessage("Team_Name"),
            Team_Tasks: getErrorMessage("Team_Tasks"),
            Completed: "",
            userExistsError: "",
          });
        }
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
  };

  return (
    <div
      className={`fixed top-0 left-0 min-w-screen  bg-transparent z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
        AddTeambtn
          ? "h-screen opacity-100 pointer-events-auto "
          : "h-0 opacity-0 pointer-events-none scale-0"
      }`}
    >
      <div
        className={`relative w-[300px]  xl:w-[350px] xl:h-[200px] text-center bg-[#10172a] rounded-2xl py-3 px-2 ${
          AddTeambtn ? "animate-popup" : ""
        }`}
      >
        <h2 className="text-2xl  xl:text-3xl font-bold mb-3 text-green-500 text-center ">
          Add new Team
        </h2>
        <h6 className="text-red-500">{validationError.userExistsError}</h6>

        <button
          onClick={() => {
            setAddTeambtn(false);
          }}
          className="absolute top-4 right-6 text-xl lg:text-3xl  focus:outline-none cursor-pointer text-white"
          aria-label="Close button"
        >
          &times;
        </button>

        <form onSubmit={preventDefault}>
          <div className="flex flex-col justify-around items-center text-center h-[70px]">
            <div className="relative">
              <h6 className="text-red-500">{validationError.Team_Name}</h6>
              <input
                type="text"
                id="name"
                name="Team_Name"
                value={credentials.Team_Name}
                className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  rounded px-2 py-1 xl:px-4 xl:py-3 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
                placeholder="Team Name...."
                onChange={onChange}
              />
            </div>
          </div>

          <button
            onClick={createUser}
            type="submit"
            className="w-[280px] xl:w-[300px] mt-1 cursor-pointer bg-green-500 text-white py-1 px-3 xl:py-3 xl:px-6 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            aria-label="Close button"
          >
            ADD +
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
