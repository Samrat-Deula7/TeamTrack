import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import arrow from "../../assets/arrow.png";
import plus from "../../assets/plus.png";
import addEmoji from "../../assets/smile-plus.png";
import mic from "../../assets/microphone.png";
import typing from "../../assets/typing.gif";
import sendSound from "../../assets/SendMess.mp4";
import ReceiveSound from "../../assets/ReceiveMess.mp4";
import More from "../../assets/more.png";
import Send from "../../assets/send.png";
import Document from "../../assets/document.png";
import FileMedia from "../../assets/file-media.png";
import { type Chat } from "../Collaboration";
import EmojiBox from "./EmojiBox";
import FileBox from "./FileBox";
import SelectedFilePopUp from "./SelectedFilePopUp";
// Need to add live backend link before deployment.
const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");

const socket = io("https://teamtrack-yeze.onrender.com", {
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
  media_type: string;
  media_data: Uint8Array;
};
type MessageOptions = {
  message: string;
  position: string;
  user_name?: string;
  media?: File;
  mediaName?: string;
  type?: string;
};
type currentSendMedia = {
  fileName: string;
  file: File;
};

const Client: React.FC<ClientType> = ({ ChatDiv, setChatDiv, setLoading }) => {
  const host = "https://teamtrack-yeze.onrender.com";

  const [openEmoji, setOpenEmoji] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState("");

  const [openFile, setOpenFile] = useState(false);
  const [selectFiles, setSelectFiles] = useState<File[]>([]);

  const [mess, setMess] = useState("");
  let currentMedia: currentSendMedia[] = [];
  let media_type = "";

  let sendMessage: any;

  let chatDump: any = [];
  let userid: any;
  const [DataDump, setDataDump] = useState<DumpDataType[]>([]);
  const [id, setId] = useState(0);
  const [newMess, SetNewMess] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const createMessages = ({
    message,
    position,
    user_name,
    media,
    mediaName,
    type,
  }: MessageOptions) => {
    const messContainer = document.getElementById("main");

    const messRow = document.createElement("div");
    messRow.classList.add("msg-row", position === "left" ? "left" : "right");

    const bubbleWrap = document.createElement("div");
    bubbleWrap.classList.add("bubble-wrap");

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerText = message;

    if (position == "right") {
      const send = document.createElement("video");
      send.src = sendSound;
      send.setAttribute("autoplay", "");
      send.classList.add("sound");
      send.volume = 0.1;
      bubble.append(send);
    }
    if (position == "left") {
      const receive = document.createElement("video");
      receive.src = ReceiveSound;
      receive.setAttribute("autoplay", "");
      receive.classList.add("sound");
      receive.volume = 0.1;
      bubble.append(receive);
    }

    if (user_name != undefined) {
      const user = document.createElement("div");
      user.classList.add("user");
      user.innerText = user_name;
      bubble.prepend(user);
    }

    if (media != undefined) {
      if (
        type === "image/jpeg" ||
        type === "image/png" ||
        type === "image/gif" ||
        type === "image/webp" ||
        type === "image/bmp" ||
        type === "image/tiff" ||
        type === "image/svg+xml"
      ) {
        const mediaBox = document.createElement("img");
        mediaBox.src = URL.createObjectURL(media);
        mediaBox.classList.add("w-40", "md:w-60");
        bubble.append(mediaBox);
      } else if (
        type === "video/mp4" ||
        type === "video/mp3" ||
        type === "video/webm" ||
        type === "video/ogg" ||
        type === "video/mpeg" ||
        type === "video/quicktime" ||
        type === "video/x-msvideo" ||
        type === "video/x-ms-wmv" ||
        type === "video/x-flv" ||
        type === "video/3gpp" ||
        type === "video/3gpp2" ||
        type === "video/x-matroska"
      ) {
        const mediaBox = document.createElement("img");
        mediaBox.src = FileMedia;
        mediaBox.classList.add("w-30");
        bubble.append(mediaBox);
      } else {
        const mediaBox = document.createElement("img");
        mediaBox.src = Document;
        mediaBox.classList.add("w-30");
        bubble.append(mediaBox);
      }
    }

    if (mediaName != undefined) {
      const mName = document.createElement("p");
      mName.innerText = mediaName as string;
      mName.classList.add("w-auto", "text-center");
      bubble.append(mName);
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

  const createTypingAni = (userN: string) => {
    const messContainer = document.getElementById("main");

    const messRow = document.createElement("div");
    messRow.classList.add("msg-row", "left", "DelRow");

    const typingEff = document.createElement("img");
    typingEff.classList.add("typing-eff");
    typingEff.src = typing;

    messRow.append(typingEff);
    if (userN != undefined) {
      const user = document.createElement("div");
      user.classList.add("user");
      user.innerText = userN;
      messRow.prepend(user);
    }

    messContainer?.append(messRow);
  };

  const deleteTypingAni = () => {
    const messContainers = document.getElementsByClassName(
      "DelRow",
    ) as HTMLCollectionOf<Element>;
    if (messContainers.length > 0) {
      for (let i = 0; i < messContainers.length; i++) {
        messContainers[i].innerHTML = "";
      }
    }
  };

  const onChange = (e: any) => {
    setMess(e.target.value);
  };
  const populateConversation = async (mediaId?: number) => {
    try {
      setLoading(true);
      const url = `${host}/api/conversation/talk`;
      const FlowTrackAuthtoken = localStorage.getItem("FlowTrackToken");

      let message;

      if (mediaId! > 0) {
        message = "\u200B";
      } else {
        message = mess;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          FlowTrackAuthtoken: FlowTrackAuthtoken || "",
        },
        body: JSON.stringify({
          mess: message,
          teamName: ChatDiv.team,
          mediaId: mediaId,
        }),
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

  const populateMedia = async (dataToUpload: any) => {
    try {
      const url = `${host}/api/upload/media`;

      let response = await fetch(url, {
        method: "POST",
        body: dataToUpload,
      });

      let result: { mediaId: number } = await response.json();

      console.log("media id" + result.mediaId);

      if (result.mediaId > 0) {
        populateConversation(result.mediaId);
      }
    } catch (error) {
      console.log("Uploading didn't work");
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

    const newMedia = [
      ...currentMedia,
      ...Array.from(selectFiles).map((file) => ({
        fileName: file.name,
        file,
      })),
    ];

    if (selectFiles.length > 0) {
      console.log(newMedia[0].file.type);
      media_type = newMedia[0].file.type;
    }

    if (mess.trim() !== "" || selectFiles.length > 0) {
      socket.emit("send-message", {
        teamName: ChatDiv.team,
        message: sendMessage,
        MediaData: newMedia,
        MediaType: media_type,
      });
    }
    const dataToUpload = new FormData();

    // Data to send in the body of request.
    for (const file of selectFiles) {
      dataToUpload.append("file", file!);
    }

    populateMedia(dataToUpload);

    if (mess.trim() !== "") {
      createMessages({ message: "You: " + sendMessage, position: "right" });
      SetNewMess(newMess + 1);
      setMess("");
    }

    if (selectFiles.length > 0) {
      selectFiles.map((file: File) => {
        createMessages({
          message: "You: ",
          position: "right",
          media: file,
          mediaName: file.name,
          type: file.type,
        });
        SetNewMess(newMess + 1);
      });

      setSelectFiles([]);
    }
  };

  useEffect(() => {
    const handler = (data: {
      message: string;
      userName: string;
      MediaData: currentSendMedia[];
      MediaType: string;
    }) => {
      if (!data.MediaData || data.message != "") {
        createMessages({
          message: data.message,
          position: "left",
          user_name: data.userName,
        });
        SetNewMess(newMess + 1);
      } else {
        console.log("media data below");
        console.log(data.MediaType);
        console.log(data.MediaData[0]!.file);
        if (data.MediaData.length == 1) {
          createMessages({
            message: "",
            position: "left",
            user_name: data.userName,
            media: data.MediaData[0].file,
            mediaName: data.MediaData[0].fileName,
            type: data.MediaType,
          });
          SetNewMess(newMess + 1);
        } else {
          data.MediaData.map((file: currentSendMedia) => {
            createMessages({
              message: "",
              position: "left",
              user_name: data.userName,
              media: file.file,
              mediaName: file.fileName,
            });
            SetNewMess(newMess + 1);
          });
        }
      }
    };

    socket.on("receive-message", handler);

    const typeAnimate = (data: { userName: string }) => {
      createTypingAni(data.userName);
      SetNewMess(newMess + 1);

      const timeout = setTimeout(() => {
        deleteTypingAni();
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    };

    socket.on("sendingText", typeAnimate);

    return () => {
      socket.off("receive-message", handler);
      socket.off("sendingText", typeAnimate); // ✅ cleanup
    };
  }, []);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, newMess]);

  useEffect(() => {
    if (mess) {
      setIsTyping(true);
    }
  }, [mess]);

  useEffect(() => {
    if (isTyping) {
      socket.emit("typing", {
        teamName: ChatDiv.team,
      });
      setTimeout(() => {
        setIsTyping(false);
      }, 4000);
    }
  }, [isTyping]);

  useEffect(() => {
    setMess(mess + selectEmoji);
    setSelectEmoji("");
  }, [selectEmoji]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 128)}px`; // cap growth at 128px
    }
  }, [mess]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as any);
    }
  };

  return (
    <>
      {/* Right Panel - Content Section - Hidden on mobile and tablet, visible on laptop+ */}
      <div
        className={`lg:flex items-center justify-center xl:pb-5  w-full h-[calc(100vh-110px)] md:h-[calc(100vh-140px)]  bg-white/20 backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${ChatDiv.on ? "flex" : "hidden"}`}
      >
        {/* This is the top bar */}
        <div
          className={`w-full  px-3 py-2 bg-transparent backdrop-blur-md shadow-lg absolute top-0 rounded-t-xl ${ChatDiv.team == "" ? "hidden" : "flex"}`}
        >
          <span className="font-bold text-xs md:text-xl text-green-500 mx-7">
            {ChatDiv.team}
          </span>
        </div>
        {/* This is the messages left and right block */}
        <div
          className="messages-block xl:max-h-[calc(100vh-250px)]"
          id="messages-block"
        >
          <div
            className="pr-2  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent overflow-y-auto overflow-x-hidden "
            id="main"
          >
            {DataDump.map((talk: DumpDataType) => {
              // if (talk.conversation.includes("\u200B")) {
              //   return null;
              // }
              // console.log(talk.media_data.length);
              // console.log(talk.media_type);

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
          <EmojiBox
            openEmoji={openEmoji}
            setOpenEmoji={setOpenEmoji}
            setSelectEmoji={setSelectEmoji}
          />
          <FileBox
            openFile={openFile}
            setOpenFile={setOpenFile}
            selectFiles={selectFiles}
            setSelectFiles={setSelectFiles}
          />
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

        {/* This is the div showing selected file */}

        <div className="absolute bottom-13 left-5 md:left-13 flex justify-start items-center gap-x-2 w-150 ">
          {selectFiles.length > 2 ? (
            <>
              {selectFiles.slice(0, 2)?.map((eachFile: any, i) => (
                <SelectedFilePopUp
                  key={i}
                  eachFile={eachFile}
                  selectFiles={selectFiles}
                  id={i}
                  setSelectFiles={setSelectFiles}
                />
              ))}
              <div className="flex justify-center items-center  p-3 w-10 h-10 bg-green-500  rounded-full">
                <img src={More} alt="more" />
              </div>
            </>
          ) : (
            <>
              {selectFiles?.map((eachFile: any, i) => (
                <SelectedFilePopUp
                  key={i}
                  eachFile={eachFile}
                  selectFiles={selectFiles}
                  id={i}
                  setSelectFiles={setSelectFiles}
                />
              ))}
            </>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className={`absolute bottom-1 z-5 flex items-end bg-white rounded-3xl shadow-lg w-[95%] min-h-10 max-h-40 px-3 py-2 mt-2 mb-1 m-auto ${ChatDiv.team == "" ? "hidden" : "flex"}`}
        >
          <img
            src={plus}
            onClick={() => {
              setOpenFile(true);
              setOpenEmoji(false);
            }}
            alt="search"
            className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 mr-3 mb-1 cursor-pointer"
          />
          <img
            src={addEmoji}
            onClick={() => {
              setOpenEmoji(true);
              setOpenFile(false);
            }}
            alt="search"
            className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mr-5 mb-1 cursor-pointer"
          />

          <div className="flex items-end justify-between w-full">
            <textarea
              ref={textareaRef}
              placeholder="Send Message ..."
              value={mess}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 min-h-[24px] outline-none resize-none overflow-y-auto whitespace-pre-wrap break-words text-gray-700 placeholder-gray-400 text-xs sm:text-base min-w-0 py-1 leading-5"
            />
            <img
              src={mic}
              alt="search"
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-2 mb-1 mr-2 cursor-pointer"
            />

            <button className="  bg-green-400 w-7 h-7 p-1 rounded-full  duration-300 hover:text-green-500 hover:bg-transparent cursor-pointer">
              <img src={Send} alt="Send the message" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Client;
