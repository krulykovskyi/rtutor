import './App.css';
import Chat from './ui/components/Chat/Chat';
import Chatcode from './ui/components/Chatcode';
import Sidebar from './ui/components/Sidebar/Sidebar';

function App() {
  return (
    <div className="app bg-gray-900 w-1/1 h-screen flex p-1">
      <Sidebar />
      <div className='flex border-2 ml-2 border-yellow-500 rounded-lg w-full'>
        <Chat />
        <Chatcode />
      </div>
    </div>
  );
}

export default App;
