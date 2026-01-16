import React, { useState, useRef, useEffect } from 'react';

interface CommandOutput {
  id: number;
  command: string;
  output: string[];
  isAnimated?: boolean;
}

const techJokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "There are only 10 types of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, approaches two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they can't C#!",
  "Hardware: The part of a computer you can kick.",
  "There's no place like 127.0.0.1",
  "I would tell you a UDP joke, but you might not get it.",
  "Why did the programmer quit his job? Because he didn't get arrays!",
  "Debugging: Being the detective in a crime movie where you're also the murderer.",
  "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.' He returns with 12 loaves.",
  "To understand recursion, you must first understand recursion.",
  "Algorithm: A word used by programmers when they don't want to explain what they did.",
  "The best thing about a boolean is that even if you're wrong, you're only off by a bit.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 = Dec 25!",
  "I've got a really good UDP joke to tell you but I don't know if you'll get it.",
  "!false - It's funny because it's true.",
  "A foo walks into a bar, takes a look around and says 'Hello World!'",
  "Programming is like writing a book... except if you miss a single comma on page 126 the whole thing makes no sense.",
  "Why did the developer go broke? Because he used up all his cache!",
  "In order to understand recursion you must first understand recursion.",
];

const hackerQuotes = [
  "ACCESS GRANTED... Just kidding. Nice try though.",
  "Accessing mainframe... Please wait...",
  "Bypassing firewall... [████████░░] 80%",
  "Decrypting neural network pathways...",
  "Initiating Gibson protocols...",
  "Connecting to satellite uplink...",
  "Tracing route through 47 proxies...",
  "Compiling kernel exploits...",
  "Injecting payload into memory buffer...",
  "Overclocking neural interface...",
  "Downloading the internet... 2% complete",
  "Hacking time and space continuum...",
  "Accessing Pentagon... Access Denied. Worth a shot!",
  "Running polymorphic code injection...",
  "Spoofing MAC address: DE:AD:BE:EF:CA:FE",
];

const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

const CommandPromptApp: React.FC = () => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 0,
      command: '',
      output: [
        'Microsoft(R) Windows XP [Version 5.1.2600]',
        '(C) Copyright 1985-2001 Microsoft Corp.',
        '',
        'Type "help" for available commands. Type "hack" for fun!',
        '',
      ],
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [currentDir, setCurrentDir] = useState('C:\\Users\\Guest');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(1);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addOutput = (command: string, output: string[], isAnimated = false) => {
    const newEntry: CommandOutput = {
      id: idCounter.current++,
      command,
      output,
      isAnimated,
    };
    setHistory(prev => [...prev, newEntry]);
  };

  const generateMatrix = (): string[] => {
    const lines: string[] = [];
    for (let i = 0; i < 8; i++) {
      let line = '';
      for (let j = 0; j < 60; j++) {
        line += matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      lines.push(line);
    }
    return lines;
  };

  const generateAsciiSkull = (): string[] => [
    '      _______________',
    '     /               \\',
    '    /                 \\',
    '   |   XXXX    XXXX    |',
    '   |   XXXX    XXXX    |',
    '   |    XX      XX     |',
    '   \\        __         /',
    '    |      /__\\       |',
    '    \\      |  |      /',
    '     \\     |  |     /',
    '      \\    |__|    /',
    '       \\__________/',
    '',
    '  >> SYSTEM COMPROMISED <<',
  ];

  const runHackSequence = () => {
    setIsHacking(true);
    setHackProgress(0);
    
    const stages = [
      'Initializing hack sequence...',
      'Scanning for vulnerabilities...',
      'Found open port: 31337',
      'Exploiting buffer overflow...',
      'Injecting shellcode...',
      'Bypassing authentication...',
      'Accessing mainframe...',
      'Downloading secret files...',
      'Covering tracks...',
      'Hack complete! (just kidding, this is for fun)',
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        addOutput('', [stages[currentStage]]);
        setHackProgress((currentStage + 1) / stages.length * 100);
        currentStage++;
      } else {
        clearInterval(interval);
        setIsHacking(false);
        addOutput('', [...generateAsciiSkull()]);
      }
    }, 800);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const [command, ...args] = trimmedCmd.split(' ');
    const lowerCmd = command.toLowerCase();

    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, trimmedCmd]);
    }
    setHistoryIndex(-1);

    switch (lowerCmd) {
      case 'help':
        addOutput(trimmedCmd, [
          'Available commands:',
          '',
          '  help        - Display this help message',
          '  cls/clear   - Clear the screen',
          '  dir/ls      - List directory contents',
          '  cd          - Change directory',
          '  echo        - Display a message',
          '  date        - Display current date',
          '  time        - Display current time',
          '  whoami      - Display current user',
          '  ver         - Display Windows version',
          '  ping        - Ping a host (simulated)',
          '  ipconfig    - Display IP configuration',
          '  systeminfo  - Display system information',
          '',
          'Fun commands:',
          '  hack        - Start a "hacking" sequence',
          '  matrix      - Display Matrix-style text',
          '  joke        - Tell a tech joke',
          '  quote       - Display a hacker quote',
          '  skull       - Display ASCII skull',
          '  cowsay      - Make a cow say something',
          '  fortune     - Get your fortune',
          '  calc        - Simple calculator (e.g., calc 2+2)',
          '  color       - Change text color',
          '',
        ]);
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        break;

      case 'dir':
      case 'ls':
        addOutput(trimmedCmd, [
          ` Volume in drive C has no label.`,
          ` Volume Serial Number is 1337-HACK`,
          '',
          ` Directory of ${currentDir}`,
          '',
          '04/15/2004  09:23 AM    <DIR>          .',
          '04/15/2004  09:23 AM    <DIR>          ..',
          '04/15/2004  09:23 AM    <DIR>          Documents',
          '04/15/2004  09:23 AM    <DIR>          Downloads',
          '04/15/2004  09:23 AM    <DIR>          Music',
          '04/15/2004  09:23 AM    <DIR>          Pictures',
          '04/15/2004  10:45 AM             1,337 secret_plans.txt',
          '04/15/2004  11:02 AM            31,337 totally_not_a_virus.exe',
          '04/15/2004  02:15 PM               420 readme.txt',
          '               3 File(s)         33,094 bytes',
          '               6 Dir(s)  13,371,337,420 bytes free',
          '',
        ]);
        break;

      case 'cd':
        if (args.length === 0 || args[0] === '~') {
          setCurrentDir('C:\\Users\\Guest');
        } else if (args[0] === '..') {
          const parts = currentDir.split('\\');
          if (parts.length > 1) {
            parts.pop();
            setCurrentDir(parts.join('\\') || 'C:');
          }
        } else {
          setCurrentDir(`${currentDir}\\${args[0]}`);
        }
        addOutput(trimmedCmd, []);
        break;

      case 'echo':
        addOutput(trimmedCmd, [args.join(' ')]);
        break;

      case 'date':
        addOutput(trimmedCmd, [
          `The current date is: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })}`,
        ]);
        break;

      case 'time':
        addOutput(trimmedCmd, [
          `The current time is: ${new Date().toLocaleTimeString()}`,
        ]);
        break;

      case 'whoami':
        addOutput(trimmedCmd, ['DESKTOP-XP\\Guest', '', 'Status: Elite Hacker (in training)']);
        break;

      case 'ver':
        addOutput(trimmedCmd, [
          '',
          'Microsoft Windows XP [Version 5.1.2600]',
          'Service Pack 2',
          '',
        ]);
        break;

      case 'ping':
        if (args.length === 0) {
          addOutput(trimmedCmd, ['Usage: ping <hostname>']);
        } else {
          const host = args[0];
          addOutput(trimmedCmd, [
            '',
            `Pinging ${host} with 32 bytes of data:`,
            '',
            `Reply from ${host}: bytes=32 time=${Math.floor(Math.random() * 50 + 10)}ms TTL=64`,
            `Reply from ${host}: bytes=32 time=${Math.floor(Math.random() * 50 + 10)}ms TTL=64`,
            `Reply from ${host}: bytes=32 time=${Math.floor(Math.random() * 50 + 10)}ms TTL=64`,
            `Reply from ${host}: bytes=32 time=${Math.floor(Math.random() * 50 + 10)}ms TTL=64`,
            '',
            `Ping statistics for ${host}:`,
            '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)',
            '',
          ]);
        }
        break;

      case 'ipconfig':
        addOutput(trimmedCmd, [
          '',
          'Windows IP Configuration',
          '',
          'Ethernet adapter Local Area Connection:',
          '',
          '   Connection-specific DNS Suffix  . : home.local',
          '   IP Address. . . . . . . . . . . . : 192.168.1.337',
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '   Default Gateway . . . . . . . . . : 192.168.1.1',
          '',
        ]);
        break;

      case 'systeminfo':
        addOutput(trimmedCmd, [
          '',
          'Host Name:                 DESKTOP-XP',
          'OS Name:                   Microsoft Windows XP Professional',
          'OS Version:                5.1.2600 Service Pack 2 Build 2600',
          'System Manufacturer:       Totally Real PC Company',
          'System Model:              Hackintosh 9000',
          'Processor(s):              1 Processor(s) Installed.',
          '                           [01]: x86 Pentium 4 @ 3.0 GHz',
          'Total Physical Memory:     512 MB',
          'Available Physical Memory: 128 MB (Chrome is running)',
          'Virtual Memory: Max Size:  1,024 MB',
          '',
        ]);
        break;

      case 'hack':
        if (!isHacking) {
          runHackSequence();
        } else {
          addOutput(trimmedCmd, ['Hack already in progress...']);
        }
        break;

      case 'matrix':
        addOutput(trimmedCmd, [
          '',
          'Wake up, Neo...',
          'The Matrix has you...',
          '',
          ...generateMatrix(),
          '',
        ]);
        break;

      case 'joke':
        const joke = techJokes[Math.floor(Math.random() * techJokes.length)];
        addOutput(trimmedCmd, ['', joke, '']);
        break;

      case 'quote':
        const quote = hackerQuotes[Math.floor(Math.random() * hackerQuotes.length)];
        addOutput(trimmedCmd, ['', quote, '']);
        break;

      case 'skull':
        addOutput(trimmedCmd, ['', ...generateAsciiSkull()]);
        break;

      case 'cowsay':
        const message = args.length > 0 ? args.join(' ') : 'Moo!';
        const border = '_'.repeat(message.length + 2);
        addOutput(trimmedCmd, [
          '',
          ` ${border}`,
          `< ${message} >`,
          ` ${'-'.repeat(message.length + 2)}`,
          '        \\   ^__^',
          '         \\  (oo)\\_______',
          '            (__)\\       )\\/\\',
          '                ||----w |',
          '                ||     ||',
          '',
        ]);
        break;

      case 'fortune':
        const fortunes = [
          'You will find a bug in your code... right after you deploy.',
          'A wise programmer once said: "It works on my machine."',
          'Your next Stack Overflow search will be enlightening.',
          'The one who clears the cache shall find the truth.',
          'Beware of code written on Fridays.',
          'Your semicolon is missing. Look harder.',
          'The rubber duck knows the answer.',
          'Git push --force is in your future. Be careful.',
          'Coffee will solve this problem. More coffee.',
          'The bug is not in the compiler. It never is.',
        ];
        addOutput(trimmedCmd, ['', fortunes[Math.floor(Math.random() * fortunes.length)], '']);
        break;

      case 'calc':
        if (args.length === 0) {
          addOutput(trimmedCmd, ['Usage: calc <expression> (e.g., calc 2+2)']);
        } else {
          try {
            const expr = args.join('').replace(/[^0-9+\-*/().]/g, '');
            // Safe evaluation for basic math
            const result = Function('"use strict"; return (' + expr + ')')();
            addOutput(trimmedCmd, [`= ${result}`]);
          } catch {
            addOutput(trimmedCmd, ['Error: Invalid expression']);
          }
        }
        break;

      case 'color':
        addOutput(trimmedCmd, [
          'Available colors: green, amber, white, blue, red, cyan',
          'Usage: Just imagine it changed! (This is a simulation)',
          '',
          '  ██ GREEN  - Classic hacker terminal',
          '  ██ AMBER  - Retro computing vibes',
          '  ██ WHITE  - Default Windows style',
          '',
        ]);
        break;

      case 'exit':
        addOutput(trimmedCmd, ['Nice try! You cannot escape the command prompt...']);
        break;

      case 'sudo':
        addOutput(trimmedCmd, [
          '',
          'NICE TRY! This is Windows, not Linux.',
          'But I appreciate the effort.',
          '',
        ]);
        break;

      case 'rm':
        if (args.includes('-rf') && args.includes('/')) {
          addOutput(trimmedCmd, [
            '',
            'Whoa there! I see what you are trying to do...',
            'Not today, friend. Not today.',
            '',
          ]);
        } else {
          addOutput(trimmedCmd, ['Command not found. Type "help" for available commands.']);
        }
        break;

      case 'gibson':
        addOutput(trimmedCmd, [
          '',
          '  ╔═══════════════════════════════════════════════╗',
          '  ║     ELLINGSON MINERAL COMPANY MAINFRAME       ║',
          '  ║              GIBSON SUPERCOMPUTER             ║',
          '  ╠═══════════════════════════════════════════════╣',
          '  ║  STATUS: ONLINE                               ║',
          '  ║  SECURITY LEVEL: MAXIMUM                      ║',
          '  ║  USERS CONNECTED: 1337                        ║',
          '  ╚═══════════════════════════════════════════════╝',
          '',
          '  ACCESS DENIED - NICE TRY, ZERO COOL!',
          '',
        ]);
        break;

      case '':
        addOutput('', []);
        break;

      default:
        addOutput(trimmedCmd, [
          `'${command}' is not recognized as an internal or external command,`,
          'operable program or batch file.',
          '',
          'Type "help" for available commands.',
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div 
      className="h-full bg-black text-[#c0c0c0] font-mono text-sm overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto p-2 whitespace-pre-wrap"
      >
        {history.map((entry) => (
          <div key={entry.id}>
            {entry.command && (
              <div className="text-[#c0c0c0]">
                <span className="text-[#00ff00]">{currentDir}&gt;</span> {entry.command}
              </div>
            )}
            {entry.output.map((line, i) => (
              <div 
                key={i} 
                className={entry.isAnimated ? 'animate-pulse text-green-400' : ''}
              >
                {line}
              </div>
            ))}
          </div>
        ))}
        
        {/* Hack progress bar */}
        {isHacking && (
          <div className="mt-2">
            <div className="text-green-400">
              Progress: [{('█'.repeat(Math.floor(hackProgress / 5)) + '░'.repeat(20 - Math.floor(hackProgress / 5)))}] {Math.floor(hackProgress)}%
            </div>
          </div>
        )}
        
        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-[#00ff00]">{currentDir}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none ml-1 text-[#c0c0c0] caret-[#c0c0c0]"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPromptApp;
