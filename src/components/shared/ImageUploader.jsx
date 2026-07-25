import { useState, useRef } from 'react';
import { uploadGitHubImage } from '../../hooks/useGitHubWrite';

export default function ImageUploader({ onUploadSuccess, label = "Upload Image" }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (.png, .jpg, .webp, .gif)');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = await uploadGitHubImage(file);
      setSuccess(true);
      onUploadSuccess(url);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload image to GitHub');
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed p-4 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[100px] text-center ${
          dragActive 
            ? 'border-[#388bfd] bg-[#388bfd]/5' 
            : uploading 
              ? 'border-[#4fcea6] bg-[#4fcea6]/5'
              : 'border-[#1e2d4a] hover:border-[#388bfd] bg-[#060a14]'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#4fcea6] border-t-transparent animate-spin"></div>
            <span className="font-mono text-xs text-[#4fcea6] tracking-widest uppercase">
              // UPLOADING_TO_GITHUB //
            </span>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-1">
            <svg className="w-6 h-6 text-[#4fcea6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-mono text-xs text-[#4fcea6] uppercase tracking-wider">
              Upload Success!
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-6 h-6 text-[#8fa3c0] group-hover:text-[#388bfd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-mono text-xs text-[#8fa3c0]">
              {label} — Drag & drop image here or <span className="text-[#388bfd] underline">browse</span>
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-[#e55353] font-mono text-[11px] mt-1">{error}</p>
      )}
    </div>
  );
}
