import error from "./assets/404-error.gif";
import success from "./assets/party.gif";

export type AlertType = {
  alert: boolean;
  type: "success" | "failure";
  msg: string;
};

type LoginProps = {
  setAlertPopUp: React.Dispatch<React.SetStateAction<AlertType>>;
  AlertPopUp: AlertType;
};

const Alert: React.FC<LoginProps> = ({ AlertPopUp, setAlertPopUp }) => {
  return (
    <div
      className={`fixed top-0 left-0 max-w-screen w-full bg-[#020617CC] z-80 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
        AlertPopUp.alert
          ? "h-screen opacity-100 pointer-events-auto"
          : "h-0 opacity-0 pointer-events-none scale-0"
      }`}
    >
      <div
        className={`relative 2xl:-top-80 w-[300px] xl:w-[550px]  text-start bg-[#10172a]  rounded-2xl py-3 px-2 ${
          AlertPopUp.alert ? "animate-popup" : ""
        }`}
      >
        <div
          className={`w-[100%] h-[100%]  border-b-2 pl-3   ${AlertPopUp.type == "success" ? "border-b-green-500" : "border-b-red-500"}`}
        >
          <div className="w-[70%] break-words whitespace-normal">
            <h2
              className={`text-[15px]  xl:text-3xl font-bold mb-4  text-start ${AlertPopUp.type == "success" ? "text-green-500" : "text-red-500"}`}
            >
              {AlertPopUp.type.toUpperCase()}
            </h2>
            <h2 className="text-[11px]  xl:text-2xl font-bold mb-4 text-white text-start">
              {AlertPopUp.msg}
            </h2>

            <button
              onClick={() => {
                setAlertPopUp({ ...AlertPopUp, alert: false });
              }}
              className="absolute top-1 right-2  text-white text-xl lg:text-3xl  focus:outline-none cursor-pointer "
              aria-label="Close button"
            >
              &times;
            </button>
          </div>
          <img
            src={AlertPopUp.type == "success" ? success : error}
            alt="error img"
            className="absolute top-10 right-4 w-11 xl:w-25 ring-2 ring-gray-400 ring-opacity-50 rounded-lg"
          />

          <button
            onClick={() => {
              setAlertPopUp({ ...AlertPopUp, alert: false });
            }}
            className="w-[240px] xl:w-[260px] mt-1 mb-2 cursor-pointer   bg-white text-black  px-2 py-1 xl:px-2 xl:py-2 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-green-500"
            aria-label="Close button"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
