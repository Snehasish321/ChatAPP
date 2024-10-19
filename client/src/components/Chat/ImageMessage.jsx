import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const isCurrentUser = message?.senderId === currentChatUser?.id;

  return (
    <div className={`p-1 rounded-lg ${isCurrentUser ? "bg-incoming-background" : "bg-outgoing-background"}`}>
      <div className="relative">
        <Image 
          src={`${HOST}/${message.message}`}
          className="rounded-lg"
          alt="asset"
          height={300}
          width={300}
          onError={(e) => { e.target.src = '/fallback-image.png'; }} // Fallback image
        />
        {/*<div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.createdAt)}
          </span>
          {isCurrentUser && (
            <span className="text-bubble-meta">
              <MessageStatus messageStatus={message.messageStatus} />
            </span>
          )}
        </div>*/}
      </div>
    </div>
  );
}

export default ImageMessage;
