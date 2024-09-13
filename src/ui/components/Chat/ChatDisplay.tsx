import Message from "./Chat";
import  { useRef, useEffect } from 'react';



type ChatDisplayProps = {
  messages: Message[];
}

export default function Chatdisplay( { messages }:ChatDisplayProps ) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
 
  return (
    <div 
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 scrollbar-hide"
      >
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div 
              className={`inline-block p-2 rounded-lg ${
                message.isUser 
                  ? 'bg-yellow-500 text-gray-900' 
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
  )
}