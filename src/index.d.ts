import React from 'react';

export type SharedValues = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly zoomValue: number;
  readonly rotationValue: number;
  readonly isLoading: boolean;
  readonly error: string;
};

export type RenderProps = {
  Viewer: React.FC;
  onNextPage: () => void;
  onPrevPage: () => void;
  onIncreaseZoom: () => void;
  onDecreaseZoom: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  getDocumentData: () => SharedValues;
};

export interface PDFViewerProps extends React.Props<PDFViewer> {
  src: string;
  zoomStep?: number;
  minZoom?: number;
  children: (renderProps: RenderProps) => React.ReactNode;
}

declare class PDFViewer extends React.Component<PDFViewerProps, any> {}

declare module 'react-pdf-view' {}

export default PDFViewer;
