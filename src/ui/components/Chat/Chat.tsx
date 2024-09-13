import { useState, useRef, useEffect } from 'react';
import './Chat.css';
import ChatDisplay from './ChatDisplay';
import ChatInput from './ChatInput';

export default interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

export default function Chat() {
  interface Message {
    id: string;
    text: string;
    isUser: boolean;
    image?: string;
  }
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([
        ...messages,
        { text: inputMessage, isUser: true, id: Date.now().toString() },
      ]);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full w-4/5 bg-gray-800 rounded-lg overflow-hidden border-r border-yellow-400">
      <ChatDisplay messages={messages} />
      <ChatInput
        inputMessage={inputMessage}
        textareaRef={textareaRef}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
