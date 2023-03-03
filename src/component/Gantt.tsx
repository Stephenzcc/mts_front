import React, { useEffect, useRef, useState } from 'react';
import { Chart } from '@antv/g2';
import { getTrend } from '../api/interface';

/**
 * @param props
 * @returns
 */
const Gantt: React.FC = (props) => {
  const container = useRef(null);
  const instance: any = useRef(null);
  const [trendData, setTrendData]: any[] = useState([]);

  useEffect(() => {
    if (!instance.current) {
      instance.current = renderGanttChart(container.current);
    }
    getTrend().then((res: any) => {
      setTrendData(res['res']);
    });
  }, []);

  useEffect(() => {
    if (instance.current) {
      const interval = instance.current.getNodesByType('interval')[0];
      interval.data(trendData);
      // 重新渲染
      instance.current.render();
    }
  }, [trendData]);

  // 渲染折线图
  function renderGanttChart(container: any) {
    const chart = new Chart({
      container,
      autoFit: true,
    });

    chart.coordinate({ transform: [{ type: 'transpose' }] });

    // 声明可视化
    chart
      .interval()
      .data(trendData)
      .encode('x', 'name')
      .encode('y', ['endTime', 'startTime'])
      .encode('color', 'trend')
      .scale('color', {
        range: ['#d61d5a', '#57c5ee'],
      });
    chart.interaction('elementSelectByColor');
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

export default Gantt;
