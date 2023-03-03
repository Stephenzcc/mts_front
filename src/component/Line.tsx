import React, { useEffect, useRef, useState } from 'react';
import { Chart } from '@antv/g2';
import { Renderer } from '@antv/g-webgl';
import { deleteCSV, getDiscords } from '../api/interface';
import { ATTR, COLOR } from '../utils/color';
import { useUpdateEffect } from 'react-use';

type Props = {
  discords: any;
  setDiscords: any;
  selectOptions: any;
  selectIndex: any;
  windows: number;
};

/**
 * @param props
 * @returns
 */
const Line: React.FC<Props> = (props) => {
  const { discords, setDiscords, selectOptions, selectIndex, windows } = {
    ...props,
  };

  const container = useRef(null);
  const instance: any = useRef(null);

  const [init, setInit] = useState<boolean>(true);
  // 折线图数据
  const [lineDataLink, setLineDataLink] = useState<string>('');

  useEffect(() => {
    if (!instance.current) {
      instance.current = initChart(container.current);
    } else if (init) {
      renderLineChart(instance.current);
    } else {
      updateData(instance.current, lineDataLink, discords);
    }
  }, [lineDataLink, discords, init]);

  // 选中散点时触发
  useUpdateEffect(() => {
    if (selectIndex.length) {
      // export const getSeq = (index: any[], attr: any[]) => {
      //   return get(`getSeqByAttr?index=${index.join('-')}&attr=${attr.join('-')}`);
      // };
      // getSeq(selectedIndex, selectOptions).then((res: any) => {
      //   console.log(res);
      // });
      getDiscords(selectIndex, selectOptions, windows).then((res: any) => {
        const { discords } = res;
        console.log(res);
        setDiscords(discords);
        setLineDataLink(
          `http://127.0.0.1:5000/getSeqByAttr?index=${selectIndex.join(
            '-'
          )}&attr=${selectOptions.join('-')}&windows=${windows}`
        );
      });
      return () => {
        deleteCSV();
      };
    }
  }, [selectIndex, selectOptions, windows]);

  function initChart(container: any) {
    const chart = new Chart({
      container,
      autoFit: true,
    });
    return chart;
  }
  // 渲染折线图
  function renderLineChart(chart: any) {
    // 声明可视化
    chart.data({
      type: 'fetch',
      value:
        `http://127.0.0.1:5000/getSeqByAttr?index=${selectIndex.join(
          '-'
        )}&attr=${ATTR.join(
          '-'
        )}&windows=7`,
      format: 'csv',
    });
    chart.interaction('elementHighlight');
    chart.scale('x', {
      compare: (a: any, b: any) => {
        const c = parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]);
        return c === 0
          ? parseInt(a.split('-')[1]) - parseInt(b.split('-')[1])
          : c;
      },
    });
    chart.axis('x', {
      title: 'time',
      tick: true,
      tickLength: 12,
      tickFilter: (datum: any, index: any, data: any) => {
        return datum.split('-')[1] === '01';
      },
      grid: true,
    });

    // 异常区域
    chart
      .rangeX()
      .data(discords)
      .encode('x', 'date')
      .encode('color')
      .scale('color', { independent: true, range: ['#f7686f88'] })
      .legend('color', false)
      .style('fillOpacity', 0.75);

    // 折线图
    chart
      .line()
      .scale('y', { independent: true })
      .axis('y', {
        position: 'left',
        titleFill: '#000',
        title: 'content ()',
      })
      .encode('x', 'date')
      .encode('y', 'value')
      .encode('shape', 'smooth')
      .encode('series', 'sample')
      .encode('color', 'attr')
      .scale('color', {
        independent: true,
        // 指定映射后的颜色
        range: COLOR.map((item: string) => {
          return item.slice(0, 7);
        }),
      });

    // 柱状图
    chart
      .interval()
      .axis('y', {
        position: 'right',
        titleFill: '#000',
        title: 'mp ()',
      })
      .transform({ type: 'stackY' })
      .encode('x', 'date')
      .encode('y', 'mp')
      .encode('color', 'attr')
      .scale('color', {
        independent: true,
        // 指定映射后的颜色
        range: COLOR,
      })
      .legend('color', false);

    // 渲染可视化
    chart.render();
    setInit(false);
  }

  // 数据更新
  function updateData(
    chart: any,
    lineDataLink: any = undefined,
    discords: any = undefined
  ) {
    console.log(lineDataLink, discords);
    if (lineDataLink !== '') {
      chart.data({
        type: 'fetch',
        value: lineDataLink,
        format: 'csv',
      });
      chart.getNodesByType('line')[0].legend('color', true);
    }
    if (discords) {
      chart.getNodesByType('rangeX')[0].changeData(discords);
    }
    chart.render();
  }

  return (
    <>
      <div ref={container} style={{ width: '100%', height: '95%' }}></div>
    </>
  );
};

export default Line;
