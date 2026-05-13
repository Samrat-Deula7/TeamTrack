import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import AfterLoggedIn from "./AfterLoggedIn";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bg from "./LandingPageComponents/Bg";
import FlowtrackState from "../context/FlowtrackState";

// This is after logged in components
import Background from "./AfterLoggedInComponents/background";
import Nav from "./AfterLoggedInComponents/Nav";
import Tasks from "./AfterLoggedInComponents/Tasks";
import TeamSetting from "./AfterLoggedInComponents/TeamSetting";
import Collaboration from "./AfterLoggedInComponents/Collaboration";
import Visualization from "./AfterLoggedInComponents/Visualization";
import History from "./AfterLoggedInComponents/History";
import Iteration from "./AfterLoggedInComponents/Iteration";
import AddTeam from "./AfterLoggedInComponents/AddTeam";

import Alert, { type AlertType } from "./Alert";
import { type TeamData } from "../context/FlowtrackState";

import { type IndividualTeamTaskElements } from "./AfterLoggedInComponents/TeamSetting";
import { type TeamTasks } from "../context/FlowtrackState";
function App() {
  let navigate = useNavigate();
  const [Loggedin, setLoggedin] = useState(false);
  const [Loginbtn, setLoginbtn] = useState(false);
  const [Signupbtn, setSignupbtn] = useState(false);
  const [AddTeambtn, setAddTeambtn] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false);
  const [teamSetting, setteamSetting] = useState(false);
    const [TeamTasks, setTeamTasks] = useState<TeamTasks[]>([]);

  const [AlertPopUp, setAlertPopUp] = useState<AlertType>({
    alert: false,
    type: "failure",
    msg: "This is an default alert",
  });
  const [IndividualTeamTask, setIndividualTeamTask] =
    useState<IndividualTeamTaskElements>({
      Team_Id: 1,
      Team_Name: "inisiti data",
      Team_code: "inisiti data",
    });
      const [AllTeamData, setAllTeamData] = useState<TeamData[]>([]);


  useEffect(() => {
    Loggedin ? navigate("/") : navigate("/landing");
  }, [Loggedin]);

  useEffect(() => {
    if (Loginbtn || Signupbtn || AlertPopUp.alert || AddTeambtn) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [Loginbtn, Signupbtn, AlertPopUp.alert, AddTeambtn]);
  return (
    <>
      <FlowtrackState>
        <Routes>
          <Route
            path="/landing"
            element={
              <>
                <Bg />
                <Alert AlertPopUp={AlertPopUp} setAlertPopUp={setAlertPopUp} />
                <Landing
                  setLoginbtn={setLoginbtn}
                  Loginbtn={Loginbtn}
                  Signupbtn={Signupbtn}
                  setLoggedin={setLoggedin}
                  setSignupbtn={setSignupbtn}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <Background />
                <Nav
                  setLoggedin={setLoggedin}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                  setmenuOpen={setmenuOpen}
                  menuOpen={menuOpen}
                />
                <AfterLoggedIn />
              </>
            }
          />

          {/* This are after logged in components */}
          <Route
            path="/tasks"
            element={
              <>
                <Nav
                  setLoggedin={setLoggedin}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                  setmenuOpen={setmenuOpen}
                  menuOpen={menuOpen}
                />
                {teamSetting && (
                  <TeamSetting
                    setteamSetting={setteamSetting}
                    IndividualTeamTask={IndividualTeamTask}
                    setTeamTasks={setTeamTasks}
                    TeamTasks={TeamTasks}
                    AlertPopUp={AlertPopUp}
                    setAlertPopUp={setAlertPopUp}
                  />
                )}

                {!teamSetting && (
                  <>
                    <AddTeam
                      AddTeambtn={AddTeambtn}
                      setAddTeambtn={setAddTeambtn}
                      setAlertPopUp={setAlertPopUp}
                      AlertPopUp={AlertPopUp}
                      AllTeamData={AllTeamData}
                      setAllTeamData={setAllTeamData}
                    />
                    <Tasks
                      setAlertPopUp={setAlertPopUp}
                      AlertPopUp={AlertPopUp}
                      setAddTeambtn={setAddTeambtn}
                      AddTeambtn={AddTeambtn}
                      setteamSetting={setteamSetting}
                      IndividualTeamTask={IndividualTeamTask}
                      setIndividualTeamTask={setIndividualTeamTask}
                      setTeamTasks={setTeamTasks}
                      TeamTasks={TeamTasks}
                      AllTeamData={AllTeamData}
                      setAllTeamData={setAllTeamData}
                    />
                  </>
                )}
              </>
            }
          />
          <Route
            path="/collaboration"
            element={
              <>
                <Nav
                  setLoggedin={setLoggedin}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                  setmenuOpen={setmenuOpen}
                  menuOpen={menuOpen}
                />
                <AddTeam
                  AddTeambtn={AddTeambtn}
                  setAddTeambtn={setAddTeambtn}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                />
                <Collaboration setAddTeambtn={setAddTeambtn} />
              </>
            }
          />
          <Route
            path="/visualization"
            element={
              <>
                <Nav
                  setLoggedin={setLoggedin}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                  setmenuOpen={setmenuOpen}
                  menuOpen={menuOpen}
                />
                <Visualization />
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <Nav
                  setLoggedin={setLoggedin}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                  setmenuOpen={setmenuOpen}
                  menuOpen={menuOpen}
                />
                <History />
              </>
            }
          />
          <Route
            path="/iteration"
            element={
              <>
                <Nav
                  setLoggedin={setLoggedin}
                  setAlertPopUp={setAlertPopUp}
                  AlertPopUp={AlertPopUp}
                  setmenuOpen={setmenuOpen}
                  menuOpen={menuOpen}
                />
                <Iteration />
              </>
            }
          />
        </Routes>
      </FlowtrackState>
    </>
  );
}

export default App;
