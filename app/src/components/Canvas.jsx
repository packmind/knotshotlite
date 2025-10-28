import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { knotData } from '../knot-data';

const Canvas = () => {
  const canvasEl = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {
      height: 800,
      width: 1200,
      backgroundColor: '#f0f0f0',
    });

    const renderKnot = (knot, left, top, angle = 0) => {
      const paths = knot.paths.map(p => new fabric.Path(p.d, {
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
      }));

      const group = new fabric.Group(paths, {
        left,
        top,
        angle,
        originX: 'center',
        originY: 'center',
      });

      canvas.add(group);
    };

    const drawGrid = (rows, cols) => {
      const topKnot = knotData.knotTop;
      const lfKnot = knotData.knotLf;
      const rfKnot = knotData.knotRf;
      const colWidth = topKnot.width;
      const margin = 5;
      let currentTop = 50;

      // Draw top row
      for (let c = 0; c < cols; c++) {
        const left = (c * (colWidth + margin)) + (colWidth / 2) + margin;
        renderKnot(topKnot, left, currentTop + topKnot.height / 2);
      }

      currentTop += topKnot.height * 0.8;

      // Draw remaining rows
      for (let r = 1; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const knot = c % 2 === 0 ? lfKnot : rfKnot;
          const left = (c * (colWidth + margin)) + (colWidth / 2) + margin;
          renderKnot(knot, left, currentTop, 90);
        }
        currentTop += lfKnot.width * 0.75;
      }
    };

    drawGrid(3, 5);
    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasEl} />;
};

export default Canvas;
