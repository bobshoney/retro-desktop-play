import React, { useState } from 'react';

type Operation = '+' | '-' | '*' | '/' | null;

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [isScientific, setIsScientific] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (left: number, right: number, op: Operation): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : 0;
      default: return right;
    }
  };

  const equals = () => {
    if (previousValue === null || operation === null) return;
    
    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const sqrt = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
    }
  };

  const inverse = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(1 / value));
    }
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Memory functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };
  const memoryStore = () => setMemory(parseFloat(display));
  const memoryAdd = () => setMemory(memory + parseFloat(display));

  // Scientific functions
  const sin = () => setDisplay(String(Math.sin(parseFloat(display) * Math.PI / 180)));
  const cos = () => setDisplay(String(Math.cos(parseFloat(display) * Math.PI / 180)));
  const tan = () => setDisplay(String(Math.tan(parseFloat(display) * Math.PI / 180)));
  const log = () => setDisplay(String(Math.log10(parseFloat(display))));
  const ln = () => setDisplay(String(Math.log(parseFloat(display))));
  const exp = () => setDisplay(String(Math.exp(parseFloat(display))));
  const power = () => {
    performOperation('*');
    // This is a simplification - real calc would handle x^y
  };
  const pi = () => {
    setDisplay(String(Math.PI));
    setWaitingForOperand(true);
  };

  const buttonClass = "h-7 text-xs font-medium border border-gray-400 bg-[#ece9d8] hover:bg-[#ddd9c8] active:bg-[#ccc9b8] rounded-sm shadow-sm";
  const operatorClass = "h-7 text-xs font-medium border border-gray-400 bg-[#e6c8c8] hover:bg-[#d6b8b8] active:bg-[#c6a8a8] rounded-sm shadow-sm";
  const numberClass = "h-7 text-sm font-bold border border-gray-400 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-sm shadow-sm";

  return (
    <div className="h-full flex flex-col bg-[#ece9d8]">
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-1 text-xs border-b border-gray-400">
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* View toggle */}
      <div className="px-2 py-1 border-b border-gray-300">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input 
            type="checkbox" 
            checked={isScientific}
            onChange={() => setIsScientific(!isScientific)}
            className="w-3 h-3"
          />
          Scientific
        </label>
      </div>

      {/* Display */}
      <div className="mx-2 mt-2 mb-2 p-1 bg-white border-2 border-gray-400 text-right font-mono text-xl" style={{ borderStyle: 'inset' }}>
        {display.length > 20 ? parseFloat(display).toExponential(10) : display}
      </div>

      {/* Button grid */}
      <div className="flex-1 px-2 pb-2">
        {isScientific ? (
          <div className="grid grid-cols-6 gap-1 h-full">
            {/* Row 1 - Scientific */}
            <button className={buttonClass} onClick={memoryClear}>MC</button>
            <button className={buttonClass} onClick={memoryRecall}>MR</button>
            <button className={buttonClass} onClick={memoryStore}>MS</button>
            <button className={buttonClass} onClick={memoryAdd}>M+</button>
            <button className={buttonClass} onClick={backspace}>←</button>
            <button className={buttonClass} onClick={clear}>C</button>

            {/* Row 2 - Scientific */}
            <button className={buttonClass} onClick={sin}>sin</button>
            <button className={buttonClass} onClick={cos}>cos</button>
            <button className={buttonClass} onClick={tan}>tan</button>
            <button className={numberClass} onClick={() => inputDigit('7')}>7</button>
            <button className={numberClass} onClick={() => inputDigit('8')}>8</button>
            <button className={numberClass} onClick={() => inputDigit('9')}>9</button>

            {/* Row 3 - Scientific */}
            <button className={buttonClass} onClick={log}>log</button>
            <button className={buttonClass} onClick={ln}>ln</button>
            <button className={buttonClass} onClick={exp}>exp</button>
            <button className={numberClass} onClick={() => inputDigit('4')}>4</button>
            <button className={numberClass} onClick={() => inputDigit('5')}>5</button>
            <button className={numberClass} onClick={() => inputDigit('6')}>6</button>

            {/* Row 4 - Scientific */}
            <button className={buttonClass} onClick={pi}>π</button>
            <button className={buttonClass} onClick={sqrt}>√</button>
            <button className={buttonClass} onClick={inverse}>1/x</button>
            <button className={numberClass} onClick={() => inputDigit('1')}>1</button>
            <button className={numberClass} onClick={() => inputDigit('2')}>2</button>
            <button className={numberClass} onClick={() => inputDigit('3')}>3</button>

            {/* Row 5 - Scientific */}
            <button className={operatorClass} onClick={() => performOperation('/')}>÷</button>
            <button className={operatorClass} onClick={() => performOperation('*')}>×</button>
            <button className={operatorClass} onClick={() => performOperation('-')}>−</button>
            <button className={numberClass} onClick={toggleSign}>±</button>
            <button className={numberClass} onClick={() => inputDigit('0')}>0</button>
            <button className={numberClass} onClick={inputDecimal}>.</button>

            {/* Row 6 - Scientific */}
            <button className={operatorClass} onClick={() => performOperation('+')}>+</button>
            <button className={buttonClass} onClick={percentage}>%</button>
            <button className={operatorClass} onClick={equals} style={{ gridColumn: 'span 2' }}>=</button>
            <button className={buttonClass} onClick={clearEntry} style={{ gridColumn: 'span 2' }}>CE</button>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1 h-full">
            {/* Row 1 */}
            <button className={buttonClass} onClick={memoryClear}>MC</button>
            <button className={buttonClass} onClick={memoryRecall}>MR</button>
            <button className={buttonClass} onClick={memoryStore}>MS</button>
            <button className={buttonClass} onClick={memoryAdd}>M+</button>
            <button className={buttonClass} onClick={backspace}>←</button>

            {/* Row 2 */}
            <button className={buttonClass} onClick={clearEntry}>CE</button>
            <button className={buttonClass} onClick={clear}>C</button>
            <button className={buttonClass} onClick={toggleSign}>±</button>
            <button className={buttonClass} onClick={sqrt}>√</button>
            <button className={operatorClass} onClick={() => performOperation('/')}>÷</button>

            {/* Row 3 */}
            <button className={numberClass} onClick={() => inputDigit('7')}>7</button>
            <button className={numberClass} onClick={() => inputDigit('8')}>8</button>
            <button className={numberClass} onClick={() => inputDigit('9')}>9</button>
            <button className={buttonClass} onClick={percentage}>%</button>
            <button className={operatorClass} onClick={() => performOperation('*')}>×</button>

            {/* Row 4 */}
            <button className={numberClass} onClick={() => inputDigit('4')}>4</button>
            <button className={numberClass} onClick={() => inputDigit('5')}>5</button>
            <button className={numberClass} onClick={() => inputDigit('6')}>6</button>
            <button className={buttonClass} onClick={inverse}>1/x</button>
            <button className={operatorClass} onClick={() => performOperation('-')}>−</button>

            {/* Row 5 */}
            <button className={numberClass} onClick={() => inputDigit('1')}>1</button>
            <button className={numberClass} onClick={() => inputDigit('2')}>2</button>
            <button className={numberClass} onClick={() => inputDigit('3')}>3</button>
            <button className={operatorClass} onClick={equals} style={{ gridRow: 'span 2' }}>=</button>
            <button className={operatorClass} onClick={() => performOperation('+')}>+</button>

            {/* Row 6 */}
            <button className={numberClass} onClick={() => inputDigit('0')} style={{ gridColumn: 'span 2' }}>0</button>
            <button className={numberClass} onClick={inputDecimal}>.</button>
            <button className={buttonClass}></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorApp;
