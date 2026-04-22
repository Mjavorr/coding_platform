import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/NavBar';

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get('exerciseId');
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setUploading(false);
        
        if (exerciseId) {
          setTimeout(() => navigate(`/results/${exerciseId}`), 500);
        } else {
          alert('Upload complete!');
        }
      }
    }, 200);
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
  };

  const backTo = exerciseId ? `/exercise/${exerciseId}` : '/exercises';

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar title={exerciseId ? "Upload Solution File" : "Upload Files"} showBack={true} showLeaderboard={true} backTo={backTo} />

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-gray-700 rounded-lg shadow-lg p-8 border border-gray-600">
          <h2 className="text-2xl font-bold mb-2 text-white">
            {exerciseId ? 'Upload Your Solution' : 'Upload Code Files'}
          </h2>
          <p className="text-gray-400 mb-6">
            Supported formats: .js, .py, .java, .cpp, .c, .txt
          </p>
          
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition ${
              isDragging
                ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                : 'border-gray-500 bg-gray-800 hover:border-gray-400'
            }`}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <p className="text-gray-300 text-lg mb-2">
              {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
            </p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            
            <label className="cursor-pointer">
              <span className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition inline-block">
                Browse Files
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".js,.py,.java,.cpp,.c,.txt"
              />
            </label>
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-900 p-2 rounded">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading... ${progress}%` : 'Upload File'}
          </button>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-600 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-green-500 h-4 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-gray-400 text-sm mt-2">{progress}%</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-white mb-3">Upload Guidelines:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Make sure your code includes all necessary functions</li>
            <li>• File should be properly formatted and commented</li>
            <li>• Test your code locally before uploading</li>
            <li>• Maximum file size: 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}