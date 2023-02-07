import React, { useEffect, useState } from 'react';
import { Chart } from '@antv/g2';

const fake = [
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: 1,
    unemployment: 2,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: 2,
    unemployment: 2,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: 3,
    unemployment: 2,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: 4,
    unemployment: 2,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: 5,
    unemployment: 2,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: 6,
    unemployment: 2,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: 1,
    unemployment: 3,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: 2,
    unemployment: 3,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: 3,
    unemployment: 3,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: 4,
    unemployment: 3,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: 5,
    unemployment: 3,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: 6,
    unemployment: 3,
  },
]

/**
 * @param props
 * @returns
 */
const Line: React.FC = (props) => {
  const [data, setData]: any[] = useState(fake)
  const chart = new Chart({
    container: 'container',
    autoFit: true,
  });
  useEffect(()=>{

  }, data)
  // 初始化option
  useEffect(() => {
    chart
      .line()
      .data(data)
      .encode('x', 'date')
      .encode('y', 'unemployment')
      .encode('series', 'division')
      .encode('color', 'steelblue');
    chart.render();
  }, []);
  return <div id='container' style={{ width: '100%', height: '100%' }}></div>;
};

export default Line;
