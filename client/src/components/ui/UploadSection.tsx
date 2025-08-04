import React from 'react';
import UploadFileDropzone from './UploadFileDropzone';
import AddTextContent from './AddTextContent';
import { TextArea } from './TextArea';

interface UploadSectionProps {
  showTextArea: boolean;
  setShowTextArea: (show: boolean) => void;
  textContent: string;
  setTextContent: (text: string) => void;
  handleFiles: (fileList: FileList) => void;
  handleAddContent: () => void;
  isUploading: boolean;
  textUploadPending: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  showTextArea,
  setShowTextArea,
  textContent,
  setTextContent,
  handleFiles,
  handleAddContent,
  isUploading,
  textUploadPending,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <UploadFileDropzone onFiles={handleFiles} />
      {showTextArea ? (
        <div className="flex flex-col space-y-4">
          <TextArea
            label="Enter Text Content"
            value={textContent}
            onChange={e => setTextContent(e.target.value)}
            rows={10}
            className="text-white"
            placeholder="Paste or type your content here..."
            disabled={textUploadPending}
          />
          <div className="flex space-x-4">
            <button
              onClick={handleAddContent}
              disabled={textUploadPending || !textContent.trim()}
              className="px-4 py-2 bg-white font-medium rounded-lg text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {textUploadPending ? 'Adding...' : 'Add Content'}
            </button>
            <button
              onClick={() => {
                setShowTextArea(false);
                setTextContent('');
              }}
              disabled={textUploadPending}
              className="px-4 py-2 bg-transparent hover:bg-[#0c0c0c] rounded-lg text-white border cursor-pointer border-[#1e1e1e]  disabled:opacity-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => setShowTextArea(true)} className="cursor-pointer">
          <AddTextContent />
        </div>
      )}
    </div>
  );
};

export default UploadSection; 