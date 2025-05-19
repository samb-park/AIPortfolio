import React from 'react';

const RESUME_PDF_URL = 'https://samb-park.github.io/blogdata/resume.pdf';

const ResumePage = () => (
  <iframe
    src={RESUME_PDF_URL}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      border: 'none',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      zIndex: 999999,
    }}
    title="Resume"
  />
);

export default ResumePage;
