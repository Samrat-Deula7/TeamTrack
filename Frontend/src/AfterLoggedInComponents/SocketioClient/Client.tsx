import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Need to add live backend link before deployment.

const socket = io("http://localhost:3000", {
  auth: { FlowTrackToken: localStorage.getItem("FlowTrackToken") },
}); // connect to backend

export default function Client() {
  // const [socketId, setSocketId] = useState<any>("");

  useEffect(() => {
    socket.on("connect", () => {
      // setSocketId(socket.id);
      console.log(socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return <div></div>;
}
