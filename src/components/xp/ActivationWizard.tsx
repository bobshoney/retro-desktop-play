import React, { useState, useEffect } from 'react';
import { X, Shield, Key, Globe, Phone } from 'lucide-react';

interface ActivationWizardProps {
  onClose: () => void;
}

const ActivationWizard: React.FC<ActivationWizardProps> = ({ onClose }) => {
  const [step, setStep] = useState<'warning' | 'options' | 'activated'>('warning');
  const [daysLeft] = useState(() => Math.floor(Math.random() * 25) + 3); // 3-27 days
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setStep('activated');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
      <div className="w-[480px] bg-[#ece9d8] rounded shadow-xl border-2 border-[#0054e3] overflow-hidden">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0054e3] via-[#0066ff] to-[#0054e3] px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold">Windows Product Activation</span>
          </div>
          <button 
            onClick={onClose}
            className="w-5 h-5 bg-[#c04040] hover:bg-[#d04040] rounded-sm flex items-center justify-center text-white text-xs font-bold border border-white/30"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {step === 'warning' && (
          <div className="p-4">
            {/* Header with icon */}
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Activate Windows</h2>
                <p className="text-sm text-gray-600">
                  Your copy of Windows must be activated with Microsoft before you can continue using it.
                </p>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-[#ffffd0] border border-[#e0e000] rounded p-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="text-2xl">⚠️</div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to activate Windows.
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    After this period, you will not be able to log on to Windows until it is activated.
                  </p>
                </div>
              </div>
            </div>

            {/* Info text */}
            <p className="text-xs text-gray-600 mb-4">
              Activation helps verify that your copy of Windows is genuine and has not been used on more computers than the Microsoft Software License Terms allow.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep('options')}
                className="px-4 py-1.5 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] border border-gray-400 rounded text-sm hover:from-[#e8e8e8] hover:to-[#d0d0d0] shadow-sm"
              >
                Remind me later
              </button>
              <button
                onClick={() => setStep('options')}
                className="px-6 py-1.5 bg-gradient-to-b from-[#3c8cf5] to-[#1a5cc7] text-white border border-[#1a5cc7] rounded text-sm font-semibold hover:from-[#4a9aff] hover:to-[#2066d1] shadow-sm"
              >
                Yes, let's activate Windows
              </button>
            </div>
          </div>
        )}

        {step === 'options' && (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Select an activation method</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose how you want to activate Windows:
            </p>

            {/* Options */}
            <div className="space-y-2 mb-4">
              <label className="flex items-start gap-3 p-3 border border-gray-300 rounded hover:bg-blue-50 cursor-pointer">
                <input type="radio" name="method" defaultChecked className="mt-1" />
                <div className="flex items-start gap-3">
                  <Globe className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Activate over the Internet</p>
                    <p className="text-xs text-gray-500">Automatically activate using your Internet connection (recommended)</p>
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-300 rounded hover:bg-blue-50 cursor-pointer">
                <input type="radio" name="method" className="mt-1" />
                <div className="flex items-start gap-3">
                  <Phone className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Activate by telephone</p>
                    <p className="text-xs text-gray-500">Call Microsoft and provide your Installation ID</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep('warning')}
                className="px-4 py-1.5 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] border border-gray-400 rounded text-sm hover:from-[#e8e8e8] hover:to-[#d0d0d0] shadow-sm"
              >
                ← Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] border border-gray-400 rounded text-sm hover:from-[#e8e8e8] hover:to-[#d0d0d0] shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="px-6 py-1.5 bg-gradient-to-b from-[#3c8cf5] to-[#1a5cc7] text-white border border-[#1a5cc7] rounded text-sm font-semibold hover:from-[#4a9aff] hover:to-[#2066d1] shadow-sm disabled:opacity-70"
                >
                  {isActivating ? 'Activating...' : 'Next →'}
                </button>
              </div>
            </div>

            {/* Progress bar when activating */}
            {isActivating && (
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-1">Connecting to Microsoft activation servers...</p>
                <div className="h-4 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-pulse w-full" />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'activated' && (
          <div className="p-4">
            {/* Success header */}
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-700 mb-1">✓ Windows is now activated</h2>
                <p className="text-sm text-gray-600">
                  Thank you for activating your copy of Windows XP.
                </p>
              </div>
            </div>

            {/* Success message */}
            <div className="bg-green-50 border border-green-300 rounded p-3 mb-4">
              <p className="text-sm text-green-800">
                Your Windows XP product is successfully activated. You can now enjoy all the features of Windows XP Professional.
              </p>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              <p>Product ID: XXXXX-OEM-XXXXXXX-XXXXX</p>
              <p>Activation ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>

            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-1.5 bg-gradient-to-b from-[#3c8cf5] to-[#1a5cc7] text-white border border-[#1a5cc7] rounded text-sm font-semibold hover:from-[#4a9aff] hover:to-[#2066d1] shadow-sm"
              >
                Finish
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-100 border-t px-4 py-2 flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            Windows Product Activation helps reduce software piracy
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivationWizard;