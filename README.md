# react-pdf-viewer

[![NPM version](https://badge.fury.io/js/react-pdf-view.svg)](http://badge.fury.io/js/react-pdf-view)

## Description

PDF viewer component for React apps based on Render Props pattern.

## Installation

Install npm package:

`npm install react-pdf-view`

## Example usage

```jsx
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
        {!isLoading && <Viewer />}
        <button onClick={onPrevPage}>Prev</button>
        <button onClick={onNextPage}>Next</button>
        <button onClick={onDecreaseZoom}>-</button>
        <button onClick={onIncreaseZoom}>+</button>
        <button onClick={onRotateLeft}>Rotate left</button>
        <button onClick={onRotateRight}>Rotate right</button>
      </div>
    );
  }}
</PDFViewer>
```

## Documentation

PDF viewer share some useful functions via render props pattern:

- `Viewer` - canvas element contains rendered page
- `onNextPage` - next page handler
- `onPrevPage` - prev page handler
- `onDecreaseZoom` - decrease zoom handler
- `onIncreaseZoom` - increase zoom handler
- `onRotateLeft` - rotate left handler
- `onRotateRight` - rotate right handler
- `getDocumentData` - function which returns some additional data about PDF file and renderer state
  - isLoading - loading state
  - currentPage - current page
  - error - error messages
  - rotationValue - rotation value
  - totalPages - total pages value
  - zoomValue - zoom value

## About KISS digital

KISS digital is a digital agency located in Kraków, Poland. We provide creative, strategic and technical development of websites and mobile applications.

## Contributors

@kpowroznik
