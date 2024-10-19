import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      {/* Background Layer */}
      <div className="bg-chat-background bg-fixed h-full w-full opacity-10 fixed left-0 top-0 z-0"></div>

      {/* Chat Content Layer */}
      <div className="mx-5 my-6 relative z-10">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-3 overflow-auto">
            {messages.map((message, _index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                } mb-2`}
              >
                {/* Conditionally Render Text Message */}
                {message.type === "text" && (
                  <div
                    className={`text-white px-4 py-3 text-sm rounded-lg flex gap-2 items-end max-w-[60%] ${
                      message.senderId === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      {/* Only show MessageStatus for the sender (logged-in user) */}
                      {message.senderId === userInfo.id && (
                        <MessageStatus messageStatus={message.messageStatus} />
                      )}
                    </div>
                  </div>
                )}

                {/* Conditionally Render Image Message */}
                {message.type === "image" && (
                  <div className="max-w-[60%] relative">
                    <ImageMessage message={message} />
                    
                    {/* Timestamp and Blue Tick at the Bottom Right */}
                    <div className="absolute bottom-0 right-2 p-1 flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      {/* Only show MessageStatus for the sender (logged-in user) */}
                      {message.senderId === userInfo.id && (
                        <MessageStatus messageStatus={message.messageStatus} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
