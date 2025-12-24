import React from 'react';
import { Mail, Github, Linkedin, Globe, MessageSquare, Send } from 'lucide-react';

const ContactApp: React.FC = () => {
  return (
    <div className="p-4 font-xp text-sm overflow-auto h-full bg-white">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-blue-800">📧 Contact Me</h1>
          <p className="text-gray-600 text-xs">Let's connect! (No spam, I promise)</p>
        </div>

        {/* Contact Methods */}
        <div className="space-y-3 mb-4">
          <a 
            href="mailto:hello@example.com" 
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">Email</p>
              <p className="text-xs text-gray-600">hello@example.com</p>
            </div>
          </a>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Github className="w-5 h-5 text-gray-700" />
            <div>
              <p className="font-semibold text-gray-800">GitHub</p>
              <p className="text-xs text-gray-600">github.com/johndeveloper</p>
            </div>
          </a>

          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Linkedin className="w-5 h-5 text-blue-700" />
            <div>
              <p className="font-semibold text-blue-800">LinkedIn</p>
              <p className="text-xs text-gray-600">linkedin.com/in/johndeveloper</p>
            </div>
          </a>

          <a 
            href="https://example.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors cursor-pointer"
          >
            <Globe className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Website</p>
              <p className="text-xs text-gray-600">www.johndeveloper.com</p>
            </div>
          </a>
        </div>

        {/* Quick Message Form */}
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-gray-700">Quick Message</h3>
          </div>
          
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Your name"
              className="w-full px-3 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="email" 
              placeholder="Your email"
              className="w-full px-3 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea 
              placeholder="Your message..."
              rows={3}
              className="w-full px-3 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button className="xp-button flex items-center gap-2 text-xs">
              <Send className="w-3 h-3" />
              Send Message
            </button>
          </div>
        </div>

        {/* Fun footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Response time: Faster than Windows XP boot time! ⚡
        </p>
      </div>
    </div>
  );
};

export default ContactApp;
