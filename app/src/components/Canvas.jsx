import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const Canvas = () => {
  const canvasEl = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {
      height: 800,
      width: 800,
      backgroundColor: '#f0f0f0',
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasEl} />;
};

export default Canvas;
