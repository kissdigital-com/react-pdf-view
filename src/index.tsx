import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from './pdfViewer';

import * as pdf from './sample.pdf';

ReactDOM.render(
  <PDFViewer src={pdf} zoomStep={10} minZoom={20}>
    {({
      Viewer,
      onNextPage,
      onPrevPage,
      onIncreaseZoom,
      onDecreaseZoom,
      onRotateRight,
      onRotateLeft,
      getDocumentData,
    }) => {
      const {
        isLoading,
        currentPage,
        error,
        rotationValue,
        totalPages,
        zoomValue,
      } = getDocumentData();

      return (
        <div>
          <div>
            {String(isLoading)},{currentPage},{error},{rotationValue},
            {totalPages},{zoomValue},
          </div>
          <Viewer />
          <button onClick={onPrevPage}>prev</button>
          <button onClick={onNextPage}>next</button>
          <button onClick={onDecreaseZoom}>-</button>
          <button onClick={onIncreaseZoom}>+</button>
          <button onClick={onRotateRight}>rotate right</button>
          <button onClick={onRotateLeft}>rotate left</button>
        </div>
      );
    }}
  </PDFViewer>,
  document.getElementById('root')
);
