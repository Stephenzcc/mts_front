import React, { useEffect, useRef, useState } from 'react';
import { Chart } from '@antv/g2';
import { getTrend } from '../api/interface';
import { useUpdateEffect } from 'react-use';

type Props = {
  selectIndex: any;
  trendWindow: any;
};
/**
 * @param props
 * @returns
 */
const Gantt: React.FC<Props> = (props) => {
  const { selectIndex, trendWindow } = props;
  const container = useRef(null);
  const instance: any = useRef(null);
  const [trendData, setTrendData]: any[] = useState([]);

  useEffect(() => {
    if (!instance.current) {
      instance.current = renderGanttChart(container.current);
    }
    getTrend(trendWindow, []).then((res: any) => {
      setTrendData(res['res']);
    });
  }, []);

  useUpdateEffect(() => {
    if (selectIndex.length) {
      getTrend(trendWindow, selectIndex).then((res: any) => {
        setTrendData(res['res']);
      });
    }
  }, [selectIndex, trendWindow]);

  useUpdateEffect(() => {
    if (instance.current) {
      const interval = instance.current.getNodesByType('interval')[0];
      interval.data(trendData);
      // 重新渲染
      instance.current.render();
    }
  }, [trendData]);

  // 渲染gantt图
  function renderGanttChart(container: any) {
    const chart = new Chart({
      container,
      autoFit: true,
    });

    chart.coordinate({ transform: [{ type: 'transpose' }] });
    chart.interaction('elementHighlightByColor', true);
    // 声明可视化
    chart
      .interval()
      .data(trendData)
      .encode('x', 'name')
      .axis('y', {
        title: '',
        tick: false,
        label: false,
      })
      .encode('y', ['endTime', 'startTime'])
      .encode('color', 'trend')
      .legend('color', false)
      .scale('color', {
        range: ['#d06397', '#72c1cb'],
      })
      .state('inactive', { opacity: 0.3 });

    // 渲染可视化
    chart.render();

    return chart;
  }

  return (
    <>
      <div ref={container} style={{ width: '100%', height: '105%' }}></div>
    </>
  );
};

export default Gantt;
