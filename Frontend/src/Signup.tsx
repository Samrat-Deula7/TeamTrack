import React, { useState } from "react";
import { type AlertType } from "./Alert";

type SignupPorps = {
  setSignupbtn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginbtn: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  Signupbtn: boolean;
  AlertPopUp: AlertType;
};

const Signup: React.FC<SignupPorps> = ({
  Signupbtn,
  setSignupbtn,
  setLoginbtn,
  setAlertPopUp,
  AlertPopUp,
}) => {
const host = "https://team-track-flax.vercel.app";

  const [validationError, setValidationError] = useState({
    Name: "",
    Password: "",
    Email: "",
    Phoneno: "",
    userExistsError: "",
  });
  const [credentials, setCredentials] = useState({
    Name: "",
    Password: "",
    CPassword: "",
    Email: "",
    Phoneno: "",
  });

  const onChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const preventDefault = async (e: any) => {
    e.preventDefault();
  };

  const createUser = async () => {
    try {
      if (credentials.Password == credentials.CPassword) {
        // API Call
        const url = `${host}/api/tasks/SignUpUser`;
        const { Name, Password, CPassword, Email, Phoneno } = credentials;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            Password,
            CPassword,
            Email,
            Phoneno,
          }),
        });
        const result = await response.json();
        console.log(result);
        if (result.success) {
          // Save the auth token and redirect
          setCredentials({
            Name: "",
            Password: "",
            CPassword: "",
            Email: "",
            Phoneno: "",
          });
          setValidationError({
            Name: "",
            Password: "",
            Email: "",
            Phoneno: "",
            userExistsError: "",
          });
          setAlertPopUp({
            ...AlertPopUp,
            alert: true,
            type: "success",
            msg: result.success,
          });
          setSignupbtn(false);
          setLoginbtn(true);
          setTimeout(() => {
            
            // I am still setting the type and msg because if i dont then for a sec the alert show failure.
            setAlertPopUp({
              ...AlertPopUp,
              alert: false,
              type: "success",
              msg: result.success,
            });
          }, 3000);
        } else {
          if (result.error) {
            const alreadyExistsError = result.error;
            setValidationError({
              Name: "",
              Password: "",
              Email: "",
              Phoneno: "",
              userExistsError: alreadyExistsError,
            });
          } else {
            const getErrorMessage = (field: string) => {
              const error = result.errors.find((e: any) => e.path === field);
              return error?.msg || null;
            };
            setValidationError({
              Name: getErrorMessage("Name"),
              Password: getErrorMessage("Password"),
              Email: getErrorMessage("Email"),
              Phoneno: getErrorMessage("Phoneno"),
              userExistsError: "",
            });
          }
        }
      } else {
         setAlertPopUp({
           ...AlertPopUp,
           alert: true,
           type: "failure",
           msg: "Both password must be same",
         });
         setTimeout(() => {
           setAlertPopUp({
             ...AlertPopUp,
             alert: false,
             type: "failure",
             msg: "Both password must be same",
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
  };

  return (
    <div
      className={`fixed top-0 left-0 min-w-screen  bg-transparent z-2000 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
        Signupbtn
          ? "h-screen opacity-100 pointer-events-auto "
          : "h-0 opacity-0 pointer-events-none scale-0"
      }`}
    >
      <div
        className={`relative w-[300px]  xl:w-[350px] xl:h-[510px] text-center bg-[#10172a] rounded-2xl py-3 px-2 ${
          Signupbtn ? "animate-popup" : ""
        }`}
      >
        <h2 className="text-2xl  xl:text-3xl font-bold mb-8 text-green-500 text-center ">
          Sign Up
        </h2>
        <h6 className="text-red-500">{validationError.userExistsError}</h6>

        <button
          onClick={() => {
            setSignupbtn(false);
          }}
          className="absolute top-4 right-6 text-xl lg:text-3xl  focus:outline-none cursor-pointer text-white"
          aria-label="Close button"
        >
          &times;
        </button>

        <form onSubmit={preventDefault}>
          <div className="flex flex-col justify-around items-center text-center h-[330px]">
            <div className="relative">
              <h6 className="text-red-500">{validationError.Name}</h6>
              <input
                type="text"
                id="name"
                name="Name"
                value={credentials.Name}
                className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  rounded px-2 py-1 xl:px-4 xl:py-3 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
                placeholder="Name...."
                onChange={onChange}
              />
            </div>

            <div className="relative">
              <h6 className="text-red-500">{validationError.Password}</h6>
              <input
                type="password"
                id="password"
                name="Password"
                className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  rounded px-2 py-1 xl:px-4 xl:py-3 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
                placeholder="Enter your password"
                onChange={onChange}
                value={credentials.Password}
              />
            </div>
            <div className="relative">
              <h6 className="text-red-500">{validationError.Password}</h6>
              <input
                type="password"
                id="cpassword"
                name="CPassword"
                className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  rounded px-2 py-1 xl:px-4 xl:py-3 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
                placeholder="Confirm password"
                onChange={onChange}
                value={credentials.CPassword}
              />
            </div>
            <div className="relative">
              <h6 className="text-red-500">{validationError.Email}</h6>
              <input
                type="email"
                id="email"
                name="Email"
                className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  rounded px-2 py-1 xl:px-4 xl:py-3 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
                placeholder="example@gmail.com"
                onChange={onChange}
                value={credentials.Email}
              />
            </div>
            <div className="relative">
              <h6 className="text-red-500">{validationError.Phoneno}</h6>
              <input
                type="text"
                id="phoneno"
                name="Phoneno"
                className="w-[280px] xl:w-[300px] bg-black border border-white/10 rounded-full  rounded px-2 py-1 xl:px-4 xl:py-3 text-white transition focus:outline-none focus:border-green-500 focus:bg-[#020617CC]"
                placeholder="Enter your phone no"
                onChange={onChange}
                value={credentials.Phoneno}
              />
            </div>
          </div>

          <button
            onClick={createUser}
            type="submit"
            className="w-[280px] xl:w-[300px] mt-1 cursor-pointer bg-green-500 text-white py-1 px-3 xl:py-3 xl:px-6 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={() => {
            setSignupbtn(false);
            setLoginbtn(true);
          }}
          className="text-blue-600 underline cursor-pointer"
        >
          Already got an account ?
        </button>
      </div>
    </div>
  );
};

export default Signup;
