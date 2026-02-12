
import React, { forwardRef } from 'react';

interface FloorPlanCanvasProps {
  ref: React.Ref<HTMLCanvasElement>;
}

const FloorPlanCanvas = forwardRef<HTMLCanvasElement, Omit<FloorPlanCanvasProps, 'ref'>>((props, ref) => {
  return (
    <div className="canvas-container border border-gray-200 rounded-md overflow-hidden">
      <canvas ref={ref} />
    </div>
  );
});

FloorPlanCanvas.displayName = 'FloorPlanCanvas';

export default FloorPlanCanvas;
