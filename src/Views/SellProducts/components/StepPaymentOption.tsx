import React from 'react';
import Button from '@/Components/Button';
import { FaMoneyBillWave, FaBuffer } from 'react-icons/fa';

interface StepPaymentOptionProps {
  paymentOption: 'now' | 'later';
  setPaymentOption: (option: 'now' | 'later') => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPaymentOption: React.FC<StepPaymentOptionProps> = ({
  paymentOption,
  setPaymentOption,
  onNext,
  onBack,
}) => {
  const handleSelectOption = (option: 'now' | 'later') => {
    setPaymentOption(option);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <h3 className="text-2xl font-bold text-optimed-tiber mb-4">¿Cuándo se realizará el pago?</h3>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button
          onClick={() => handleSelectOption('now')}
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg shadow-lg transition-all duration-300
            ${paymentOption === 'now' ? 'bg-optimed-tiber text-white scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          <FaMoneyBillWave className="text-5xl mb-3" />
          <span className="text-xl font-semibold">Pagar al contado</span>
        </button>
        <button
          onClick={() => handleSelectOption('later')}
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg shadow-lg transition-all duration-300
            ${paymentOption === 'later' ? 'bg-optimed-tiber text-white scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          <FaBuffer className="text-5xl mb-3" />
          <span className="text-xl font-semibold">Pagar a cuotas</span>
        </button>
      </div>
      {/* The back button is handled by the parent component's navigation */}
    </div>
  );
};

export default StepPaymentOption;
