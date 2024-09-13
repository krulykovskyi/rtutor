import { Paperclip } from 'lucide-react';

interface ChatInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  inputMessage: string;
  handleSendMessage: () => void;
}

export default function ChatInput( {textareaRef, setInputMessage, inputMessage, handleSendMessage}: ChatInputProps ) {
  return (
    <div className="bg-gray-700 p-4">
      <div className="flex items-center">
        <button
          className="text-gray-400 hover:text-yellow-500 mr-2 focus:outline-none"
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>
        <div className="flex-grow relative">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full bg-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            placeholder="Type your message here..."
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSendMessage}
          className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-lg ml-2 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}