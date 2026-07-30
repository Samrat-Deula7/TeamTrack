import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import arrow from "../../assets/arrow.png";
import plus from "../../assets/plus.png";
import addEmoji from "../../assets/smile-plus.png";
import mic from "../../assets/microphone.png";
import { type Chat } from "../Collaboration";

// Need to add live backend link before deployment.
const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");

const socket = io("http://localhost:3000", {
  withCredentials: true, // important if you enabled credentials in backend CORS
  auth: { token: FlowTrackAuthtoken },
});
type ClientType = {
  ChatDiv: Chat;
  setChatDiv: React.Dispatch<React.SetStateAction<Chat>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type DumpDataType = {
  name: string;
  conv_id: number;
  team_id: number;
  user_id: number;
  conversation: string;
  date: string;
};

const Client: React.FC<ClientType> = ({ ChatDiv, setChatDiv, setLoading }) => {
  const host = "http://localhost:3000";

  const [mess, setMess] = useState("");
  // const [user, setUser] = useState("");

  let sendMessage: any;

  let chatDump: any = [];
  let userid: any;
  const [DataDump, setDataDump] = useState([]);
  const [id, setId] = useState(0);

  const createMessages = (
    message: string,
    position: string,
    user_name?: string,
  ) => {
    const messContainer = document.getElementById("main");

    const messRow = document.createElement("div");
    messRow.classList.add("msg-row", position === "left" ? "left" : "right");

    const bubbleWrap = document.createElement("div");
    bubbleWrap.classList.add("bubble-wrap");

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerText = message;

    if (user_name != undefined) {
      const user = document.createElement("div");
      user.classList.add("user");
      user.innerText = user_name;
      bubble.prepend(user);
    }

    const tail = document.createElement("div");
    tail.classList.add(
      "tail",
      position === "left" ? "tail-left" : "tail-right",
    );

    bubbleWrap.append(bubble);

    // order flips depending on direction
    if (position === "left") {
      messRow.append(tail, bubbleWrap);
    } else {
      messRow.append(bubbleWrap, tail);
    }

    messContainer?.append(messRow);
  };

  const onChange = (e: any) => {
    setMess(e.target.value);
  };
  const populateConversation = async () => {
    try {
      setLoading(true);
      const url = `${host}/api/conversation/talk`;
      const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({ mess: mess, teamName: ChatDiv.team }),
      });

      const result: { success: string } = await response.json();
      if (result.success != "") {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("why not working is it going to error.");
    }
  };

  const renderData = async () => {
    const url = `${host}/api/conversation/getalltalk/?teamName=${ChatDiv.team}`;
    const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        FlowTrackAuthtoken: FlowTrackAuthtoken || "",
      },
    });

    const result = await response.json();
    userid = result.userId;
    chatDump = [...result.success];
    setId(userid);
    setDataDump(chatDump);
  };

  useEffect(() => {
    renderData();
  }, [ChatDiv.team]);

  useEffect(() => {
    if (ChatDiv.team !== "") {
      socket.emit("join-team", ChatDiv.team);
    }
  }, [ChatDiv.team]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    populateConversation();
    sendMessage = mess;
    socket.emit("send-message", {
      teamName: ChatDiv.team,
      message: sendMessage,
    });

    createMessages("You: " + sendMessage, "right");
    setMess("");
  };

  useEffect(() => {
    const handler = (data: { message: string; userName: string }) => {
      createMessages(data.message, "left", data.userName);
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler); // ✅ cleanup
    };
  }, []);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id]);

  return (
    <>
      {" "}
      {/* Right Panel - Content Section - Hidden on mobile and tablet, visible on laptop+ */}
      <div
        className={`lg:flex items-center justify-center  w-full h-[500px] xl:h-[600px] 2xl:h-[800px] bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${ChatDiv.on ? "flex" : "hidden"}`}
      >
        {/* This is the top bar */}
        <div className="w-full  px-3 py-2 bg-transparent backdrop-blur-md shadow-lg absolute top-0 rounded-t-xl">
          <span className="font-bold text-xs md:text-xl text-green-500 mx-7">
            {ChatDiv.team}
          </span>
        </div>

        {/* This is the messages left and right block */}
        <div className="messages-block " id="messages-block">
          <div
            className="max-h-full pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-auto overflow-x-hidden"
            id="main"
          >
            {DataDump.map((talk: DumpDataType) => {
              const isRight = id == talk.user_id;

              const tailEl = (
                <div
                  className={`tail ${isRight ? "tail-right" : "tail-left"}`}
                />
              );

              const bubbleEl = (
                <div className="bubble-wrap">
                  <div className="bubble">
                    <div className="user">{isRight ? "You: " : talk.name}</div>
                    {talk.conversation}
                  </div>
                </div>
              );

              return (
                <div
                  className={`msg-row ${isRight ? "right" : "left"}`}
                  key={talk.conv_id}
                >
                  {isRight ? (
                    <>
                      {bubbleEl}
                      {tailEl}
                    </>
                  ) : (
                    <>
                      {tailEl}
                      {bubbleEl}
                    </>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} /> {/* invisible anchor */}
          </div>
        </div>

        <button
          onClick={() => {
            setChatDiv({ ...ChatDiv, on: false, team: "" });
          }}
          className="flex lg:hidden absolute top-2 left-2 xl:top-30 xl:right-16 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
          aria-label="Close button"
        >
          <img src={arrow} alt="back" className="w-5" />
        </button>
        <form
          onSubmit={handleSend}
          className="absolute bottom-1  flex items-center  bg-white rounded-full shadow-lg w-[95%] h-10 px-3 py-2 mt-2 mb-1 m-auto"
        >
          <img
            src={plus}
            alt="search"
            className="w-3 h-3 sm:w-4 sm:h-4  shrink-0 mr-3 cursor-pointer"
          />
          <img
            src={addEmoji}
            alt="search"
            className="w-4 h-4 sm:w-5 sm:h-5  shrink-0 mr-5 cursor-pointer"
          />

          <div className="flex items-center justify-between w-full ">
            <input
              type="text"
              placeholder="Send Message ..."
              //  value={searchQuery}
              //  onChange={(e) => setSearchQuery(e.target.value)}
              //  onKeyPress={handleKeyPress}
              value={mess}
              onChange={onChange}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-base min-w-0"
            />
            <img
              src={mic}
              alt="search"
              className="w-4 h-4 sm:w-5 sm:h-5  shrink-0 cursor-pointer"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Client;
