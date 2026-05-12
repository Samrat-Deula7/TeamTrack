import { createContext } from "react";
import {
  type Data,
  type TeamData,
  type TeamTasks,
  type addTeamTask,
} from "./FlowtrackState";

type FlowtrackContextType = {
  getAllTask: () => Promise<Data[]>;
  UpdateCompletedState: (
    Task_id: number,
    Completed: boolean,
  ) => Promise<object>;
  UpdateTeamTableCompleteState: (
    Task_id: number,
    Completed: boolean,
  ) => Promise<object>;
  DeleteTask: (Task_id: number) => void;
  DeleteTeamTask: (Team_Id: number) => Promise<object>;
  LeaveTeam: (Team_code: string) => Promise<object>;
  GetTeamData: () => Promise<TeamData[]>;
  GetTeamTasks: (Task_code: string) => Promise<TeamTasks[]>;
  addTeamTask: (TeamTask: addTeamTask) => Promise<string>;
  joinTeamWithCode: (Team_code: string) => Promise<object>;
  addUserToTeam: (Email: string, Team_Name: string, Team_code: string)=>Promise<object>;
};
const FlowtrackContext = createContext<FlowtrackContextType>({
  // Needed to put async here because the function getAllTask return and Promise
  getAllTask: async () => [], // This means that the function returns some data
  UpdateCompletedState: async () => ({}),
  UpdateTeamTableCompleteState: async () => ({}),
  DeleteTask: () => {}, // This means that the function returns void
  DeleteTeamTask: async () => ({}), // This means that the function returns void
  LeaveTeam: async () => ({}), // This means that the function returns void
  GetTeamData: async () => [],
  GetTeamTasks: async () => [],
  addTeamTask: async () => "Team Task saved !",
  joinTeamWithCode: async () => ({}),
  addUserToTeam: async () => ({}),
});

export default FlowtrackContext;

