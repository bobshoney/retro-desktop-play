import React from 'react';
import { Briefcase, GraduationCap, Code, Award, Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

const ResumeApp: React.FC = () => {
  return (
    <div className="p-4 font-xp text-sm overflow-auto h-full bg-white">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-blue-600 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-blue-800">Alex Chen</h1>
          <p className="text-gray-600 font-semibold">Senior Full Stack Developer</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> alex.chen@email.com</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> (555) 123-4567</span>
          </div>
          <div className="flex justify-center gap-4 mt-1 text-xs text-blue-600">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> alexchen.dev</span>
            <span className="flex items-center gap-1"><Github className="w-3 h-3" /> github.com/alexchen</span>
            <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> linkedin.com/in/alexchen</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <h2 className="font-bold text-blue-800 border-b border-gray-300 mb-2">Professional Summary</h2>
          <p className="text-xs text-gray-700 leading-relaxed">
            Results-driven Full Stack Developer with 8+ years of experience building scalable web applications. 
            Expert in React, Node.js, and cloud architecture. Led teams delivering products serving 2M+ users. 
            Passionate about clean code, performance optimization, and mentoring junior developers.
          </p>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Professional Experience</h2>
          </div>
          <div className="ml-2 space-y-3 text-xs">
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Senior Software Engineer</p>
                <span className="text-gray-500">2021 - Present</span>
              </div>
              <p className="text-blue-600">TechCorp Inc. | San Francisco, CA</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">
                <li>Architected microservices handling 50K+ requests/second using Node.js and Kubernetes</li>
                <li>Led React migration reducing bundle size by 40% and improving load times by 60%</li>
                <li>Mentored team of 5 developers, implementing code review best practices</li>
                <li>Designed real-time notification system using WebSockets serving 500K daily active users</li>
              </ul>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Full Stack Developer</p>
                <span className="text-gray-500">2018 - 2021</span>
              </div>
              <p className="text-blue-600">StartupXYZ | Remote</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">
                <li>Built customer-facing dashboard with React/TypeScript used by 10K+ businesses</li>
                <li>Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes</li>
                <li>Developed RESTful APIs with Express.js and PostgreSQL, 99.9% uptime</li>
              </ul>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Junior Developer</p>
                <span className="text-gray-500">2016 - 2018</span>
              </div>
              <p className="text-blue-600">WebAgency Co. | New York, NY</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">
                <li>Developed 20+ client websites using React, Vue.js, and WordPress</li>
                <li>Optimized database queries improving page load by 300%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Technical Skills</h2>
          </div>
          <div className="ml-2 text-xs space-y-1">
            <p><strong>Languages:</strong> TypeScript, JavaScript, Python, Go, SQL</p>
            <p><strong>Frontend:</strong> React, Next.js, Vue.js, Tailwind CSS, Redux, GraphQL</p>
            <p><strong>Backend:</strong> Node.js, Express, FastAPI, PostgreSQL, MongoDB, Redis</p>
            <p><strong>Cloud/DevOps:</strong> AWS, GCP, Docker, Kubernetes, Terraform, GitHub Actions</p>
            <p><strong>Tools:</strong> Git, Figma, Jira, DataDog, Sentry</p>
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Education</h2>
          </div>
          <div className="ml-2 text-xs">
            <div className="flex justify-between">
              <p className="font-semibold">B.S. Computer Science</p>
              <span className="text-gray-500">2016</span>
            </div>
            <p className="text-blue-600">University of California, Berkeley</p>
            <p className="text-gray-600">GPA: 3.8 | Dean's List | ACM Club President</p>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-800">Certifications</h2>
          </div>
          <ul className="ml-2 text-xs text-gray-700 space-y-0.5">
            <li>• AWS Solutions Architect Professional (2023)</li>
            <li>• Google Cloud Professional Developer (2022)</li>
            <li>• MongoDB Certified Developer (2021)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeApp;
