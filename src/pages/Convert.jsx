import React, { useState } from 'react';
import './Convert.css';

function Convert() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copyText, setCopyText] = useState(" Salin");

  const handleConvert = () => {
    if (inputText.trim() === '') {
      setOutputText('Silakan masukkan teks terlebih dahulu.');
      return;
    }

    const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g;

    const result = inputText.replace(urlRegex, (foundLink) => {
      if (foundLink.includes('videy.co')) {
        return foundLink.replace('videy.co', 'vip.videy.in');
      } else {
        return '';
      }
    });

    setOutputText(result);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const handleCopy = () => {
    if (!outputText) {
      alert("Tidak ada hasil untuk disalin!");
      return;
    }

    navigator.clipboard.writeText(outputText).then(() => {
      setCopyText(" Tersalin!");
      setTimeout(() => setCopyText(" Salin"), 2000);
    }).catch(err => {
      console.error('Gagal menyalin teks: ', err);
      alert("Maaf, gagal menyalin teks.");
    });
  };

  return (
    <div className="convert-wrapper">
      <div className="convert-container">
        <h1><i className="fa-solid fa-wand-magic-sparkles"></i> Pengubah Link Cerdas</h1>

        <div className="input-area">
          <label htmlFor="inputText">Teks Asli:</label>
          <textarea 
            id="inputText" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Contoh:
video 1 sangat keren
videy.co/v/?id=gewyfe
ini link lain yang akan dihapus: badlink.com
video manta
videy.co/v/?id=ge4yfe`}
          />
        </div>

        <div className="button-group">
          <button id="convertButton" className="btn-primary" onClick={handleConvert}>
            <i className="fa-solid fa-gear"></i> Proses Teks
          </button>
          <button id="clearButton" className="btn-secondary" onClick={handleClear}>
            <i className="fa-solid fa-eraser"></i> Bersihkan
          </button>
        </div>

        <div className="result-area">
          <div className="result-header">
            <h3>Hasil:</h3>
            <button id="copyButton" onClick={handleCopy}>
              <i className="fa-regular fa-copy"></i>{copyText}
            </button>
          </div>
          <pre id="hasil">{outputText}</pre>
        </div>
      </div>
    </div>
  );
}

export default Convert;
