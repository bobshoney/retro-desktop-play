import React from 'react';
import { Briefcase, GraduationCap, Code, Award, Coffee } from 'lucide-react';

const ResumeApp: React.FC = () => {
  return (
    <div className="p-4 font-xp text-sm overflow-auto h-full bg-white">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-blue-600 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-blue-800">John Developer</h1>
          <p className="text-gray-600">Full Stack Developer | XP Enthusiast</p>
          <p className="text-xs text-gray-500 mt-1">
            "I started programming when Windows XP was actually new"
          </p>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Experience</h2>
          </div>
          <div className="ml-6 space-y-2 text-xs">
            <div>
              <p className="font-semibold">Senior Developer @ TechCorp</p>
              <p className="text-gray-600">2020 - Present</p>
              <p className="text-gray-700">Building things that definitely won't crash like Windows ME</p>
            </div>
            <div>
              <p className="font-semibold">Developer @ StartupXYZ</p>
              <p className="text-gray-600">2017 - 2020</p>
              <p className="text-gray-700">Wrote code that worked 99% of the time (the other 1% was "a feature")</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Skills</h2>
          </div>
          <div className="ml-6 flex flex-wrap gap-1">
            {['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Nostalgia', 'Minesweeper Expert'].map((skill) => (
              <span key={skill} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Education</h2>
          </div>
          <div className="ml-6 text-xs">
            <p className="font-semibold">BS in Computer Science</p>
            <p className="text-gray-600">University of Technology, 2017</p>
            <p className="text-gray-700">Graduated with honors (and a lot of coffee)</p>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Fun Facts</h2>
          </div>
          <ul className="ml-6 text-xs text-gray-700 space-y-1 list-disc list-inside">
            <li>Can solve Minesweeper on expert in under 2 minutes</li>
            <li>Still uses keyboard shortcuts from 2001</li>
            <li>Has never called IT support (I AM IT support)</li>
            <li>My code compiles on the first try... sometimes</li>
          </ul>
        </div>

        {/* Awards */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Awards</h2>
          </div>
          <ul className="ml-6 text-xs text-gray-700 space-y-1 list-disc list-inside">
            <li>"Most Likely to Reference Windows XP" - Company Award 2023</li>
            <li>Employee of the Month (self-awarded, but still counts)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeApp;
