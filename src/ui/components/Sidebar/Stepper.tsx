import { useState } from 'react';
import './stepper.css';

type SteperProps = {
  isOpening: boolean
};

export default function Stepper({ isOpening }: SteperProps) {
  const steps = ['lesson', 'lesson', 'lesson', 'lesson', 'lesson'];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <div className={`${isOpening ? 'opened' :
      'shadow'} flex flex-col items-center justify-around h-full`}>
        {steps.map((step, i) => (
          <div key={i} className={`step-item text-white ${currentStep === i + 1 && 'active'} ${i + 1 < currentStep && 'complete'}`}>
            <div className={`step m-2`} onClick={() => {setCurrentStep(i + 1)}}>
              <a href="">{i + 1}</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
