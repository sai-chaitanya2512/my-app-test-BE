import React, { useEffect, useRef } from 'react';
import paper from 'paper';

const MouseAnimation = () => {
  const canvasRef = useRef(null);

useEffect(() => {
  paper.setup(canvasRef.current);

  const points = 25;
  const length = 35;

  const path = new paper.Path({
    strokeColor: '#E4141B',
    strokeWidth: 20,
    strokeCap: 'round',
  });

  const start = paper.view.center.divide([10, 1]);
  for (let i = 0; i < points; i++) {
    path.add(start.add(new paper.Point(i * length, 0)));
  }

  const tool = new paper.Tool();

  tool.onMouseMove = function (event) {
    path.firstSegment.point = event.point;
    for (let i = 0; i < points - 1; i++) {
      const segment = path.segments[i];
      const nextSegment = segment.next;
      const vector = segment.point.subtract(nextSegment.point);
      vector.length = length;
      nextSegment.point = segment.point.subtract(vector);
    }
    path.smooth({ type: 'continuous' });
  };

  tool.onMouseDown = function () {
    path.fullySelected = true;
    path.strokeColor = '#e08285';
  };

  tool.onMouseUp = function () {
    path.fullySelected = false;
    path.strokeColor = '#e4141b';
  };

  return () => {
    paper.project.clear();
    paper.view.off('resize');
  };
}, []);


  return (
    <canvas
      ref={canvasRef}
      resize="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default MouseAnimation;
