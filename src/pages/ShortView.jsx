import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

function ShortView() {
  const { id: pathId } = useParams();
  const [searchParams] = useSearchParams();
  const videoId = pathId || searchParams.get('id');
  const [loadingText, setLoadingText] = useState('⏳ Memuat video...');
  const [showLoading, setShowLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Inject external popup ad block scripts as requested in original s/index.html
    const script1 = document.createElement('script');
    script1.src = "//filingattenuate.com/78/eb/56/78eb564356465edb57c47d3471c27669.js";
    document.body.appendChild(script1);
    
    // Add original CSS styling directly for this page overrides
    document.body.style.backgroundColor = '#000';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.overflow = '';
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
    };
  }, []);

  useEffect(() => {
    if (videoId) {
      if (videoRef.current) {
        videoRef.current.load();
      }
    } else {
      setLoadingText("❌ ID video tidak ditemukan di URL.");
    }
  }, [videoId]);

  const handleLoadedData = () => {
    setShowLoading(false);
  };

  const handleError = () => {
    setLoadingText("❌ Gagal memuat video. Mengalihkan...");
    setShowLoading(true);
    setTimeout(() => {
      window.location.href = "https://cdn2.videy.in";
    }, 3000);
  };

  // Bot checker as original
  const isBot = /bot|crawl|spider|preview|facebook|twitter/i.test(navigator.userAgent);
  if (isBot) {
    return null; // hide for bot
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {showLoading && (
        <div style={{ position: 'absolute', color: '#ccc', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
          {loadingText}
        </div>
      )}
      
      <video 
        ref={videoRef}
        id="videyPlayer" 
        controls 
        controlsList="nodownload" 
        autoPlay 
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: showLoading ? 'none' : 'block' }}
        onLoadedData={handleLoadedData}
        onError={handleError}
      >
        {videoId && <source src={`https://cdn2.videy.co/${videoId}.mp4`} type="video/mp4" />}
        Browser kamu tidak mendukung video.
      </video>
    </div>
  );
}

export default ShortView;
