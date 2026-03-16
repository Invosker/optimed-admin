import { Each } from "../Each";
import { cn } from '@/lib/utils';
import { Fragment } from "react";
import Button from "@/Components/Button";

const Stepper = ({ currentStep, setCurrentStep, steps = [], children, hiddenSteps, canGo0, hiddenButtons, dontValidateNextStep }) => {
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleBackStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        // <div className="font-sans leading-normal tracking-normal h-full flex items-center justify-center">
        <div className="rounded-lg md:max-w-7xl md:mx-auto  mt-4">
            {
                !hiddenSteps &&
                <>
                    <div className="mb-6 flex items-center justify-between">
                        <Each render={(step, index) => (
                            <Fragment key={step.key}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn("w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg", currentStep === index + 1 ? "bg-sigeBlue" : "bg-red-400")}
                                    >
                                        {step.key}
                                    </div>
                                    <div className="text-sm text-gray-500 hidden xl:block">{step.title}</div>
                                </div>
                                {
                                    index !== steps.length - 1 &&
                                    <div className="flex-1 h-1 bg-gray-300"></div>
                                }
                            </Fragment>
                        )}
                            of={steps} />
                    </div>
                </>
            }
            <div className="text-center w-full grid grid-cols-2 gap-4">
                <div className='col-span-2'>
                    {children}
                </div>
                {
                    (!hiddenSteps && !hiddenButtons) &&
                    <>
                        <Button
                            label="Atrás"
                            onClick={handleBackStep}
                            disabled={canGo0 ? currentStep === 0 : currentStep === 1}
                            loading={false}
                        />
                        <Button
                            label="Siguiente"
                            onClick={handleNextStep}
                            disabled={dontValidateNextStep ? false : currentStep === steps.length}
                            loading={false}
                        />
                    </>
                }
            </div>
        </div>
        // </div>
    );
};

export default Stepper;
