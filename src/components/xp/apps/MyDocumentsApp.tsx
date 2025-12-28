import React from 'react';
import { FileText, Folder, Image, Music, Film, File } from 'lucide-react';

const files = [
  { name: 'Resume.doc', icon: FileText, size: '24 KB', modified: '12/15/2003' },
  { name: 'Cover Letter.doc', icon: FileText, size: '18 KB', modified: '12/10/2003' },
  { name: 'Project Notes.txt', icon: File, size: '4 KB', modified: '11/28/2003' },
  { name: 'My Pictures', icon: Folder, size: '', modified: '10/05/2003', isFolder: true },
  { name: 'My Music', icon: Folder, size: '', modified: '09/22/2003', isFolder: true },
  { name: 'Downloads', icon: Folder, size: '', modified: '12/01/2003', isFolder: true },
  { name: 'vacation_photo.jpg', icon: Image, size: '1.2 MB', modified: '08/15/2003' },
  { name: 'birthday_party.jpg', icon: Image, size: '890 KB', modified: '07/04/2003' },
  { name: 'favorite_song.mp3', icon: Music, size: '4.5 MB', modified: '11/20/2003' },
  { name: 'funny_video.avi', icon: Film, size: '15 MB', modified: '06/30/2003' },
];

const MyDocumentsApp: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-b from-gray-100 to-gray-200 border-b text-xs">
        <button className="px-2 py-0.5 hover:bg-gray-300 rounded">File</button>
        <button className="px-2 py-0.5 hover:bg-gray-300 rounded">Edit</button>
        <button className="px-2 py-0.5 hover:bg-gray-300 rounded">View</button>
        <button className="px-2 py-0.5 hover:bg-gray-300 rounded">Favorites</button>
        <button className="px-2 py-0.5 hover:bg-gray-300 rounded">Tools</button>
        <button className="px-2 py-0.5 hover:bg-gray-300 rounded">Help</button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 border-b">
        <span className="text-xs text-gray-600">Address:</span>
        <div className="flex-1 bg-white border px-2 py-0.5 text-xs flex items-center gap-1">
          <Folder className="w-3 h-3 text-yellow-500" />
          C:\Documents and Settings\User\My Documents
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-1 gap-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-2 py-1 hover:bg-blue-100 cursor-pointer rounded text-sm"
            >
              <file.icon className={`w-5 h-5 ${file.isFolder ? 'text-yellow-500' : 'text-blue-600'}`} />
              <span className="flex-1">{file.name}</span>
              <span className="text-gray-500 text-xs w-20">{file.size}</span>
              <span className="text-gray-500 text-xs">{file.modified}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-2 py-1 bg-gray-100 border-t text-xs text-gray-600">
        {files.length} objects
      </div>
    </div>
  );
};

export default MyDocumentsApp;