import React, { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: NodeJS.Timer;

    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);

        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [width]);

  const resizableProps: ResizableBoxProps =
    direction === 'horizontal'
      ? {
          className: 'resize-horizontal',
          minConstraints: [innerWidth * 0.2, Infinity],
          maxConstraints: [innerWidth * 0.75, Infinity],
          height: Infinity,
          width,
          resizeHandles: ['e'],
          onResizeStop: (event, data) => {
            setWidth(data.size.width);
          },
        }
      : {
          minConstraints: [Infinity, 24],
          maxConstraints: [Infinity, innerHeight * 0.9],
          height: 300,
          width: Infinity,
          resizeHandles: ['s'],
        };

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
