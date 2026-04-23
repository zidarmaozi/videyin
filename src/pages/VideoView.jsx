import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

function VideoView() {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const videoId = pathId || searchParams.get('id');
  const [videoLink, setVideoLink] = useState('');
  const [hasError, setHasError] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoId) {
      let fileType = '.mp4';
      if (videoId.length === 9 && videoId[8] === '2') {
        fileType = '.mov';
      }
      setVideoLink(`https://cdn2.videy.co/${videoId}${fileType}`);
    }
  }, [videoId]);

  useEffect(() => {
    if (videoLink && videoRef.current) {
      videoRef.current.load();

    }
  }, [videoLink]);

  const handleVideoError = (e) => {
    const error = e.target.error;
    if (error && error.code === 4) {
      setHasError(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link disalin!');
  };

  return (
    <div className="container">
      <TopNav />
      <div className="video">
        <div className="video-inner">
          {!hasError ? (
            <video 
              id="my-video" 
              ref={videoRef}
              autoPlay 
              controls 
              controlsList="nodownload" 
              width="100%" 
              playsInline
              onError={handleVideoError}
            >
              {videoLink && <source src={videoLink} type={videoLink.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />}
              Your browser does not support the video tag.
            </video>
          ) : (
            <div id="video-error" className="video-error-container">
              <div className="video-error">Video could not load.</div>
              <div className="video-error-reasons">This could be because the video was removed, your internet connection is down, the server is having issues, or the video might not have ever existed.</div>
            </div>
          )}
        </div>
      </div>
      
      {!hasError && (
        <div className="video-actions">
          <div className="video-actions-inner">
            <button className="action-btn" id="shareVideo" onClick={handleCopyLink}>Share Video</button>
            <button className="action-btn" id="copyUrl" onClick={handleCopyLink}>Copy Link</button>
            <button className="action-btn" id="reportBtn" onClick={() => setShowReportModal(true)}>Report</button>
          </div>
        </div>
      )}

      <Footer />

      {/* Modals */}
      {showReportModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowReportModal(false)}>&times;</span>
            <h2>What's wrong with this content?</h2>
            <form id="reportForm" onSubmit={(e) => { e.preventDefault(); alert("Laporan terkirim."); setShowReportModal(false); }}>
              <div className="report-options">
                <label><input type="radio" name="reportReason" value="dislike" /> I don't like it</label>
                <label><input type="radio" name="reportReason" value="hateful" /> It is hateful or offensive</label>
                <label><input type="radio" name="reportReason" value="csam" /> It is CSAM</label>
                <label><input type="radio" name="reportReason" value="illegal" /> It is illegal</label>
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoView;
