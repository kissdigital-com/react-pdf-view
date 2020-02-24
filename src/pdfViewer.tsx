import React from 'react';

import {
  version,
  GlobalWorkerOptions,
  getDocument,
  PDFDocumentProxy,
  PDFPageProxy,
  PDFPageViewport,
  PDFRenderTask,
  PDFRenderParams,
} from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

type State = {
  readonly loading: boolean;
  readonly pending: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly zoom: number;
  readonly rotation: number;
  readonly error: string;
};

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
  zoomStep: number;
  minZoom: number;
  children: (renderProps: RenderProps) => React.ReactNode;
}

export class PDFViewer extends React.Component<PDFViewerProps, State> {
  static defaultProps = {
    minZoom: 20,
    zoomStep: 10,
  };

  state: State = {
    loading: false,
    pending: -1,
    currentPage: 1,
    totalPages: 0,
    zoom: 100,
    rotation: 0,
    error: '',
  };

  pdfFile: PDFDocumentProxy | null = null;
  canvasRef = React.createRef<HTMLCanvasElement>();

  componentDidMount = () => {
    this.renderPage(this.state.currentPage);
  };

  queueRenderPage = (num: number) => {
    if (this.state.loading) {
      this.setState({
        pending: num,
      });
    } else {
      this.renderPage(num);
    }
  };

  renderPage = async (pageToRender: number) => {
    const { src } = this.props;

    try {
      this.setState({
        loading: true,
      });

      await getDocument(src).promise.then((document: PDFDocumentProxy) => {
        if (this.pdfFile) {
          this.pdfFile.destroy();
        }

        this.pdfFile = document;

        this.setState({
          totalPages: this.pdfFile.numPages,
        });
      });

      try {
        if (!this.pdfFile) {
          return;
        }
        const page: PDFPageProxy = await this.pdfFile.getPage(pageToRender);

        const viewport: PDFPageViewport = page.getViewport({
          scale: this.state.zoom / 100,
          rotation: this.state.rotation,
        });

        const canvas = this.canvasRef.current;

        if (canvas) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (!canvas.getContext('2d')) {
            throw new Error('2d context not supported');
          }

          const canvasContext: CanvasRenderingContext2D | null = canvas.getContext(
            '2d'
          );

          if (!canvasContext) {
            return;
          }

          const renderContext: PDFRenderParams = {
            canvasContext,
            viewport,
          };

          const renderTask: PDFRenderTask = page.render(renderContext);

          renderTask.promise.then(() => {
            this.setState({
              loading: false,
            });

            if (this.state.pending > 0) {
              this.renderPage(this.state.pending);

              this.setState({
                pending: 0,
              });
            }
          });
        }
      } catch (error) {
        this.setState({ error: error.message });
      }
    } catch (renderError) {
      this.setState({ error: renderError.message });
    }
  };

  onNextPage = () => {
    if (this.state.currentPage >= this.state.totalPages) {
      return;
    }

    this.setState(
      (prevState) => ({
        currentPage: prevState.currentPage + 1,
      }),
      () => {
        this.queueRenderPage(this.state.currentPage);
      }
    );
  };

  onPrevPage = () => {
    if (this.state.currentPage <= 1) {
      return;
    }

    this.setState(
      (prevState) => ({
        currentPage: prevState.currentPage - 1,
      }),
      () => {
        this.queueRenderPage(this.state.currentPage);
      }
    );
  };

  onIncreaseZoom = () => {
    this.setState(
      (prevState) => ({
        zoom: prevState.zoom + this.props.zoomStep,
      }),
      () => {
        this.queueRenderPage(this.state.currentPage);
      }
    );
  };

  onDecreaseZoom = () => {
    if (this.state.zoom >= this.props.minZoom) {
      this.setState(
        (prevState) => ({
          zoom: prevState.zoom - this.props.zoomStep,
        }),
        () => {
          this.queueRenderPage(this.state.currentPage);
        }
      );
    }
  };

  onRotateRight = () => {
    this.setState(
      (prevState) => ({
        rotation: prevState.rotation + 90,
      }),
      () => this.queueRenderPage(this.state.currentPage)
    );
  };

  onRotateLeft = () => {
    this.setState(
      (prevState) => ({
        rotation: prevState.rotation - 90,
      }),
      () => this.queueRenderPage(this.state.currentPage)
    );
  };

  getDocumentData = (): SharedValues => ({
    currentPage: this.state.currentPage,
    totalPages: this.state.totalPages,
    zoomValue: this.state.zoom,
    rotationValue: this.state.rotation,
    isLoading: this.state.loading,
    error: this.state.error,
  });

  canvas: React.FC = () => (
    <canvas
      ref={this.canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );

  render() {
    return this.props.children({
      Viewer: this.canvas,
      onNextPage: this.onNextPage,
      onPrevPage: this.onPrevPage,
      onIncreaseZoom: this.onIncreaseZoom,
      onDecreaseZoom: this.onDecreaseZoom,
      onRotateRight: this.onRotateRight,
      onRotateLeft: this.onRotateLeft,
      getDocumentData: this.getDocumentData,
    });
  }
}
