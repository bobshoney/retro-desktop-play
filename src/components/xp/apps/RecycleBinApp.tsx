import React, { useState } from 'react';
import { Trash2, FileText, Image, Folder, RefreshCw } from 'lucide-react';
import { useXPSounds } from '@/hooks/useXPSounds';

interface DeletedItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image' | 'document';
  originalLocation: string;
  deletedDate: string;
  size: string;
}

const RecycleBinApp: React.FC = () => {
  const { playRecycle, playClick, playError } = useXPSounds();
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([
    { id: '1', name: 'Old Resume.doc', type: 'document', originalLocation: 'C:\\My Documents', deletedDate: '12/15/2003 2:34 PM', size: '24 KB' },
    { id: '2', name: 'vacation_photo.jpg', type: 'image', originalLocation: 'C:\\My Pictures', deletedDate: '12/14/2003 10:22 AM', size: '1.2 MB' },
    { id: '3', name: 'temp_folder', type: 'folder', originalLocation: 'C:\\Desktop', deletedDate: '12/13/2003 4:15 PM', size: '156 KB' },
    { id: '4', name: 'notes.txt', type: 'file', originalLocation: 'C:\\My Documents', deletedDate: '12/12/2003 9:45 AM', size: '2 KB' },
    { id: '5', name: 'screenshot.bmp', type: 'image', originalLocation: 'C:\\My Pictures', deletedDate: '12/10/2003 3:30 PM', size: '2.4 MB' },
  ]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4 text-blue-600" />;
      case 'folder':
        return <Folder className="w-4 h-4 text-yellow-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-800" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleEmptyRecycleBin = () => {
    if (deletedItems.length === 0) return;
    playError();
    const confirmed = window.confirm('Are you sure you want to permanently delete all items in the Recycle Bin?');
    if (confirmed) {
      playRecycle();
      setDeletedItems([]);
    }
  };

  const handleRestoreItem = () => {
    if (!selectedItem) return;
    playClick();
    setDeletedItems(items => items.filter(item => item.id !== selectedItem));
    setSelectedItem(null);
  };

  const handleDeletePermanently = () => {
    if (!selectedItem) return;
    playError();
    const confirmed = window.confirm('Are you sure you want to permanently delete this item?');
    if (confirmed) {
      playRecycle();
      setDeletedItems(items => items.filter(item => item.id !== selectedItem));
      setSelectedItem(null);
    }
  };

  const totalSize = deletedItems.reduce((acc, item) => {
    const sizeNum = parseFloat(item.size);
    const multiplier = item.size.includes('MB') ? 1024 : 1;
    return acc + (sizeNum * multiplier);
  }, 0);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="bg-[#ece9d8] border-b border-gray-400 p-1 flex items-center gap-1">
        <button
          onClick={handleEmptyRecycleBin}
          disabled={deletedItems.length === 0}
          className="xp-button px-3 py-1 text-xs flex items-center gap-1 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Empty Recycle Bin
        </button>
        <div className="w-px h-5 bg-gray-400 mx-1" />
        <button
          onClick={handleRestoreItem}
          disabled={!selectedItem}
          className="xp-button px-3 py-1 text-xs flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          Restore
        </button>
        <button
          onClick={handleDeletePermanently}
          disabled={!selectedItem}
          className="xp-button px-3 py-1 text-xs flex items-center gap-1 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Info bar */}
      <div className="bg-gradient-to-r from-[#7b9fcf] to-[#4a7ab8] p-2 text-white text-xs flex items-center gap-2">
        <Trash2 className="w-8 h-8" />
        <div>
          <div className="font-bold">Recycle Bin</div>
          <div>{deletedItems.length} object(s) - {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize.toFixed(0)} KB`}</div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-[#ece9d8] border-b border-gray-300 flex text-xs font-semibold">
        <div className="flex-1 px-2 py-1 border-r border-gray-300">Name</div>
        <div className="w-32 px-2 py-1 border-r border-gray-300">Original Location</div>
        <div className="w-36 px-2 py-1 border-r border-gray-300">Date Deleted</div>
        <div className="w-16 px-2 py-1">Size</div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto bg-white">
        {deletedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Trash2 className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-sm">The Recycle Bin is empty</p>
          </div>
        ) : (
          deletedItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center text-xs cursor-pointer border-b border-gray-100 ${
                selectedItem === item.id 
                  ? 'bg-[#316ac5] text-white' 
                  : 'hover:bg-[#e8f4fc]'
              }`}
              onClick={() => setSelectedItem(item.id)}
              onDoubleClick={handleRestoreItem}
            >
              <div className="flex-1 px-2 py-1 flex items-center gap-2 border-r border-gray-100">
                {getIcon(item.type)}
                <span className="truncate">{item.name}</span>
              </div>
              <div className="w-32 px-2 py-1 truncate border-r border-gray-100">
                {item.originalLocation}
              </div>
              <div className="w-36 px-2 py-1 border-r border-gray-100">
                {item.deletedDate}
              </div>
              <div className="w-16 px-2 py-1 text-right">
                {item.size}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-2 py-1 text-xs text-gray-700 flex justify-between">
        <span>{selectedItem ? '1 object(s) selected' : `${deletedItems.length} object(s)`}</span>
        <span>Total Size: {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize.toFixed(0)} KB`}</span>
      </div>
    </div>
  );
};

export default RecycleBinApp;
