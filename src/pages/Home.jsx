import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

const MIME_MAP = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
  'image/webp': 'webp', 'image/bmp': 'bmp', 'image/tiff': 'tiff', 'image/heic': 'heic',
  'image/avif': 'avif', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm',
  'video/x-msvideo': 'avi', 'video/x-matroska': 'mkv', 'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg', 'audio/wav': 'wav', 'audio/aac': 'aac', 'audio/webm': 'weba'
};

function Home() {
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState("Upload a Video");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = () => {
      setIsDragging(false);
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    };
    const handlePaste = (e) => {
      if (e.clipboardData.files && e.clipboardData.files.length > 0) {
        handleFileUpload(e.clipboardData.files[0]);
      }
    };

    document.documentElement.addEventListener('dragover', handleDragOver);
    document.documentElement.addEventListener('dragleave', handleDragLeave);
    document.documentElement.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      document.documentElement.removeEventListener('dragover', handleDragOver);
      document.documentElement.removeEventListener('dragleave', handleDragLeave);
      document.documentElement.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }
  }, [isDragging]);

  const handleBoxClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    setErrorMsg("");
    
    if (file.type !== 'video/mp4' && file.type !== 'video/quicktime') {
      if (MIME_MAP[file.type]) {
        setShowFileTypeModal(true);
      } else {
        setShowUnsupportedModal(true);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const maxFileSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxFileSize) {
      setErrorMsg("Error: too large, please upload a file less than 100MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress("0%");

    const formData = new FormData();
    formData.append('file', file);
    
    const visitorId = localStorage.getItem('visitorId') || "";

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        let percentComplete = evt.loaded / evt.total;
        percentComplete = parseInt(percentComplete * 100);
        setUploadProgress(`${percentComplete}%`);
        if (percentComplete === 100) {
          setUploadProgress("Processing");
        }
      }
    }, false);

    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          localStorage.setItem('uploader', 'true');
          const url = new URL(result.link);
          const videoId = url.searchParams.get("id");
          navigate(`/v/${encodeURIComponent(videoId)}`);
        } catch (e) {
          setErrorMsg("Failed to parse response.");
          setUploadProgress("Upload a Video");
          setIsUploading(false);
        }
      } else {
        setErrorMsg("Upload failed.");
        setUploadProgress("Upload a Video");
        setIsUploading(false);
      }
    };

    xhr.onerror = function() {
      setUploadProgress("Upload a Video");
      setIsUploading(false);
    };

    xhr.open("POST", `https://videy.co/api/upload?visitorId=${encodeURIComponent(visitorId)}`);
    xhr.send(formData);
  };

  return (
    <div className="container">
      <TopNav />
      <div className="text">
        <div className="main-line">Free and Simple Video Hosting</div>
        <div className="second-line">Get started without an account</div>
      </div>
      <div className="box">
        <div 
          className={`box-upload ${isUploading ? 'animate' : ''}`} 
          onClick={handleBoxClick}
        >
          {uploadProgress}
        </div>
        <div style={{ paddingTop: '24px', display: 'none' }}>
          <span style={{ backgroundColor: '#f8f7f0', padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500 }}>
            30 NOV: Video uploading issues fixed.
          </span>
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
      />
      
      {errorMsg && <div className="upload-error" style={{ display: 'block' }}>{errorMsg}</div>}
      
      <Footer />

      {/* Modals */}
      {showFileTypeModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowFileTypeModal(false)}>&times;</span>
            <h2>Unsupported File Type</h2>
            <p>Please upload your file to <a href="https://aceimg.com" target="_blank" rel="noreferrer">AceImg.com</a> instead</p>
            <button 
              type="button" 
              onClick={() => window.open('https://aceimg.com', '_blank')}
              style={{ marginTop: '24px', width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Go to AceImg
            </button>
          </div>
        </div>
      )}

      {showUnsupportedModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowUnsupportedModal(false)}>&times;</span>
            <h2>Unsupported File Type</h2>
            <p>Only MP4 and MOV video files are supported</p>
            <button 
              type="button" 
              onClick={() => setShowUnsupportedModal(false)}
              style={{ marginTop: '24px', width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
