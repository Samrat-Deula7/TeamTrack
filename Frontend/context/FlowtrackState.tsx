import FlowtrackContext from "./FlowtrackContext";

export type Data = {
  task_id: number;
  user_id: number;
  task: string;
  completed: boolean;
};

export type TeamData = {
  team_id: number;
  user_id: number;
  team_name: string;
  team_tasks: string;
  completed: boolean;
  team_code: string;
};

export type TeamTasks = {
  team_id: number;
  user_id:number;
  name: string;
  team_tasks: string;
  completed: boolean;
  type: string;
};

export type addTeamTask = {
  Team_Name: string;
  TeamTask: string;
  Completed: false;
  Team_code: string;
};

const host = "https://team-track-eight.vercel.app";
const FlowtrackState: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Following are the API of Tasks route

  const getAllTask = async (): Promise<Data[]> => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/tasks/GetAllTasks`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
      });
      const result = await response.json();
      if (result.dataSet && Array.isArray(result.dataSet)) {
        return result.dataSet as Data[];
      }

      return [];
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const UpdateCompletedState = async (
    Task_id: number,
    Completed: boolean,
  ): Promise<object> => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/tasks/UpdateCompleteState`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Task_Id: Task_id, Completed: Completed }),
      });
      const result: object = await response.json();
      return result;
    } catch (error: any) {
      alert(error.message);
      return {};
    }
  };

  const UpdateTeamTableCompleteState = async (
    Team_Id: number,
    Completed: boolean,
  ): Promise<object> => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url =
      `${host}/api/teamtasks/UpdateTeamTableCompleteState`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Team_Id: Team_Id, Completed: Completed }),
      });
      const result = await response.json();
      return result;
    } catch (error: any) {
      alert(error.message);
      return {};
    }
  };

  const UpdateTeamTableUserType = async (
    User_Id: number,
    Team_code: string,
    SetType: string,
  ): Promise<object> => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/UpdateTeamTableUserType`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({
          User_Id: User_Id,
          Team_code: Team_code,
          SetType: SetType,
        }),
      });
      const result = await response.json();
      return result;
    } catch (error: any) {
      alert(error.message);
      return {};
    }
  };

  const DeleteTask = async (Task_id: number) => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/tasks/DeleteTask`;
    try {
      const response = fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Task_Id: Task_id }),
      });
    } catch (error: any) {
      alert(error.message);
    }
  };
  
  const DeleteTeamTask = async (Team_Id: number) => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/DeleteTeamTask`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Team_Id: Team_Id }),
      });
      const result = await response.json();
      return result;
    } catch (error: any) {
      alert(error.message);
      return {};
    }
  };

  // Following are the API of TeamTasks route

  const GetTeamData = async () => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/GetTeamData`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
      });
      const result = await response.json();
      if (result.dataSet && Array.isArray(result.dataSet)) {
        return result.dataSet as TeamData[];
      }

      return [];
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const GetTeamTasks = async (Task_code: string) => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/getTeamTasks`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
          Team_code: Task_code,
        },
      });
      const result = await response.json();
      if (result.tasks && Array.isArray(result.tasks)) {
        return result.tasks as TeamTasks[];
      }
      return [];
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const addTeamTask = async (TeamTask: addTeamTask) => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/CreateTeamTask`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({
          Team_Name: TeamTask.Team_Name,
          TeamTask: TeamTask.TeamTask,
          Completed: TeamTask.Completed,
          Team_code: TeamTask.Team_code,
        }),
      });
      const result = await response.json();
      if (result.success) {
        return result.success;
      }
      return [];
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const joinTeamWithCode = async (Team_code: string) => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/joinTeamWithCode`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Team_code: Team_code }),
      });
      const result = await response.json();
      if (result) {
        return result;
      }
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const addUserToTeam = async(Email:string, Team_Name:string, Team_code:string)=>{
    const url = `${host}/api/teamtasks/addUserToTeam`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: Email,
          Team_Name: Team_Name,
          Team_code: Team_code,
        }),
      });
      const result = await response.json();
      if (result) {
        return result;
      }
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const LeaveTeam = async(Team_code:string)=>{
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/LeaveTeam`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Team_code: Team_code }),
      });
      const result = await response.json();
      if (result) {
        return result;
      }
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };

  const DeleteTeam = async (Team_code: string) => {
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");
    const url = `${host}/api/teamtasks/DeleteTeam`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ Team_code: Team_code }),
      });
      const result = await response.json();
      if (result) {
        return result;
      }
    } catch (error: any) {
      alert(error.message);
      return [];
    }
  };
  return (
    <FlowtrackContext.Provider
      value={{
        getAllTask,
        UpdateCompletedState,
        UpdateTeamTableCompleteState,
        UpdateTeamTableUserType,
        DeleteTask,
        DeleteTeamTask,
        GetTeamData,
        GetTeamTasks,
        addTeamTask,
        joinTeamWithCode,
        addUserToTeam,
        LeaveTeam,
        DeleteTeam,
      }}
    >
      {children}
    </FlowtrackContext.Provider>
  );
};

export default FlowtrackState;
