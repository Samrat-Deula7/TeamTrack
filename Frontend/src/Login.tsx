import { useState } from "react";
import { useEffect } from "react";
import { type AlertType } from "./Alert";

type LoginProps = {
  setLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginbtn: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupbtn: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  Loginbtn: boolean;
  AlertPopUp: AlertType;
};

const Login: React.FC<LoginProps> = ({
  Loginbtn,
  setLoggedin,
  setLoginbtn,
  setSignupbtn,
  setAlertPopUp,
  AlertPopUp,
}) => {
const host = "http://localhost:3000";

  useEffect(() => {
    const token = localStorage.getItem("FlowTrackToken");
    if (token) {
      setLoggedin(true);
    } else {
      setLoggedin(false);
    }
  }, []);

  const [loginErrorValidation, setLoginErrorValidation] = useState({
    loginError1: "",
    loginError2: "",
  });

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const onChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const createUser = async () => {
    // API Call
    const url =`${host}/api/tasks/LoginUser`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: credentials.email,
          Password: credentials.password,
        }),
      });
      const result = await response.json();
      if (result.FlowTrackAuthtoken) {
        // Save the auth token and redirect
        setCredentials({
          email: "",
          password: "",
        });
        setAlertPopUp({
          ...AlertPopUp,
          alert: true,
          type: "success",
          msg: "Logged in Successfully",
        });
        setLoginbtn(false);

        setTimeout(() => {
          setLoggedin(true);
          localStorage.setItem("FlowTrackToken", result.FlowTrackAuthtoken);
          setAlertPopUp({ ...AlertPopUp, alert: false });
        }, 2000);
      } else {
        if (result.errors) {
          const getErrorMessage = (field: string) => {
            const errors = result.errors.find((e: any) => e.path === field);
            return errors?.msg || null;
          };
          setLoginErrorValidation({
            loginError1: getErrorMessage("Email"),
            loginError2: "",
          });
        } else {
          const error2 = result.error;
          setLoginErrorValidation({
            loginError1: "",
            loginError2: error2,
          });
        }

        setLoggedin(false);
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
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };
  return (
    <div
      className={`fixed top-0 left-0 max-w-screen w-full bg-transparent z-2000 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
        Loginbtn
          ? "h-screen opacity-100 pointer-events-auto"
          : "h-0 opacity-0 pointer-events-none scale-0"
      }`}
    >
      <div
        className={`relative  w-[300px]  xl:w-[350px] xl:h-[290px]  text-center bg-[#10172a]  rounded-2xl py-3 px-2 ${
          Loginbtn ? "animate-popup" : ""
        }`}
      >
        <h2 className="text-2xl  xl:text-3xl font-bold mb-4 text-green-500 text-center ">
          Log in
        </h2>
        <h6 className="text-red-500">{loginErrorValidation.loginError1}</h6>
        <h6 className="text-red-500">{loginErrorValidation.loginError2}</h6>
        <button
          onClick={() => {
            setLoginbtn(false);
          }}
          className="absolute top-1 right-2  text-white text-xl lg:text-3xl  focus:outline-none cursor-pointer "
          aria-label="Close button"
        >
          &times;
        </button>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-around items-center text-center h-[170px]"
        >
          <div className="relative">
            <input
              type="email"
              id="login-email"
              name="email"
              className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  px-2 py-1 xl:px-2 xl:py-2 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
              placeholder="example@gmail.com"
              onChange={onChange}
              value={credentials.email}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              id="login-password"
              name="password"
              className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  px-2 py-1 xl:px-2 xl:py-2 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
              placeholder="Enter your password"
              onChange={onChange}
              value={credentials.password}
            />
          </div>

          <button
            onClick={createUser}
            id="login"
            type="submit"
            className="w-[280px] xl:w-[300px] mt-1 cursor-pointer bg-green-500 text-white  px-2 py-1 xl:px-2 xl:py-2 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            Log in
          </button>
        </form>
        <button
          onClick={() => {
            setSignupbtn(true);
            setLoginbtn(false);
          }}
          className="text-blue-600 underline cursor-pointer"
        >
          Don't have an account?
        </button>
      </div>
    </div>
  );
};

export default Login;
