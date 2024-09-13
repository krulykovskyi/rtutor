import { useState } from 'react';
import Stepper from './Stepper';

export default function Menu() {
  const [isOpening, setIsOpening] = useState(false);

  const toggleMenu = () => {
    setIsOpening(!isOpening);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center z-10 w-16 h-16"
      >
        <img src="../../../public/menu.png" alt="menu" className={`transition-all duration-500 w-8 ${isOpening ? 'rotate-90  ' : ''}`}/>
      </button>

      <div
        className={`absolute top-0 left-0 w-16 transition-all duration-500 ease-in-out border-2 border-yellow-500 rounded-full ${
          isOpening ? 'h-max pb-5' : 'h-16'
        }`}
      >
        {isOpening && (
          <div
            className={`flex flex-col items-center justify-around pt-16 transition-opacity duration-500 ease-in-out ${
              isOpening ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Stepper isOpening={isOpening}/>
          </div>
        )}
      </div>
    </div>
  );
}
