import React, { useEffect, useRef, useState } from 'react';
import { Chart } from '@antv/g2';

/**
 * @param props
 * @returns
 */
const Feature: React.FC = (props) => {
  const container = useRef(null);
  const instance: any = useRef(null);
  const [data, setData]: any[] = useState();

  useEffect(() => {
    if (!instance.current) {
      instance.current = renderGanttChart(container.current);
    }
  }, []);

  // useEffect(() => {
  //   if (instance.current) {
  //     const interval = instance.current.getNodesByType('interval')[0];
  //     interval.data(data);
  //     // 重新渲染
  //     instance.current.render();
  //   }
  // }, [data]);

  // 渲染热力图
  function renderGanttChart(container: any) {
    const chart = new Chart({
      container,
      autoFit: true,
    });

    chart
      .data([
        { name: 1, year: 1, value: 1 },
        { name: 2, year: 1, value: 1 },
        { name: 3, year: 1, value: 1 },
        { name: 4, year: 1, value: 1 },
        { name: 5, year: 1, value: 1 },
        { name: 6, year: 1, value: 1 },
        { name: 1, year: 2, value: 1 },
        { name: 2, year: 2, value: 1 },
        { name: 3, year: 2, value: 1 },
        { name: 4, year: 2, value: 1 },
        { name: 5, year: 2, value: 1 },
        { name: 6, year: 2, value: 1 },
      ])
      .axis('x', { labelAutoRotate: false })
      .axis('y', {
        tickFilter: (d: any) => d % 10 === 0,
        position: 'top',
      })
      .scale('color', {
        type: 'sequential',
        palette: 'puRd',
        relations: [
          [(d: any) => d === null, '#eee'],
          [0, '#fff'],
        ],
      });

    chart
      .cell()
      .encode('y', 'year')
      .encode('x', 'name')
      .encode('color', 'value')
      .style('inset', 0.5);
    // 渲染可视化
    chart.render();

    return chart;
  }

  return (
    <>
      <div ref={container} style={{ width: '100%', height: '95%' }}></div>
    </>
  );
};

export default Feature;
