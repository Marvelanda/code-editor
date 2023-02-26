import React, { useRef, useEffect } from 'react';

import './preview.css';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html lang="en">
      <head>
        <style>html { background-color: white; }</style>
        <title></title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef(null);

  useEffect(() => {
    if (!iframe?.current) {
      return;
    }
    const frame = iframe.current as HTMLIFrameElement;
    frame.srcdoc = html;

    setTimeout(() => {
      if (!frame?.contentWindow) {
        return;
      }

      frame.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />

      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
