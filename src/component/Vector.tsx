import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { ATTR, DATE } from '../utils/color';
import { getContribute } from '../api/interface';
import { useUpdateEffect } from 'react-use';

type Props = {
  selectIndex: any;
};

/**
 * @param props
 * @returns
 */
const Vector: React.FC<Props> = (props) => {
  const { selectIndex } = props;

  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [contributionT, setContributionT] = useState<number[]>([]);
  const [contributionM, setContributionM] = useState<number[]>([]);
  const [nodes, setNodes] = useState<any>([]);
  const [links, setLinks] = useState<any>([]);
  const [option, setOption]: any = useState({});

  // 获取数据
  const getContibution = (index: number[]) => {
    getContribute(index).then((res: any) => {
      const { contributionT: t, contributionM: m, nodes: n, links: l } = res;
      setContributionT(t);
      setContributionM(m);
      setNodes(n);
      setLinks(l);
    });
  };

  // 获取dom初始化echart
  useEffect(() => {
    instance.current =
      echarts.getInstanceByDom(chartDom.current) ||
      //@ts-ignore
      echarts.init(chartDom.current, null);
    return (): void => {
      echarts.dispose(instance.current);
    };
  }, [chartDom]);

  // option改变
  useUpdateEffect(() => {
    if (option) {
      if (instance.current) {
        instance.current.hideLoading();
        instance.current.setOption(option);
      }
    }
  }, [option]);

  // 框选散点变化
  useUpdateEffect(() => {
    if (selectIndex.length) {
      getContibution(selectIndex);
    }
  }, [selectIndex]);

  // 数据更新
  useUpdateEffect(() => {
    const series: any[] = [...option.series];
    series[0].data = contributionT.map((item: number) => {
      return {
        value: Math.abs(item),
        itemStyle: {
          color: item >= 0 ? '#E677AA' : '#72c1cb',
        },
      };
    });
    series[1].data = contributionM.map((item: number, index: number) => {
      return {
        value: Math.abs(item),
        name: ATTR[index],
        itemStyle: {
          color: item >= 0 ? '#E677AA' : '#72c1cb',
        },
      };
    });
    series[2].data = nodes;
    series[2].links = links;
    setOption({ ...option, series });
  }, [contributionT, contributionM, nodes, links]);

  // 初始化option
  useEffect(() => {
    setOption({
      grid: {
        top: '0%',
        bottom: '0%',
        left: '0%',
      },
      polar: [
        {
          radius: ['70%', '90%'],
        },
      ],
      tooltip: {
        show: true,
      },
      angleAxis: {
        type: 'category',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: true,
          interval: 30,
        },
        axisLabel: {
          show: true,
          interval: 30,
          formatter: (value: string, index: number) => {
            return value.split('-')[0];
          },
        },
        data: DATE,
      },
      radiusAxis: {
        type: 'value',
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitArea: {
          areaStyle: {
            interval: 3,
          },
        },
      },
      series: [
        {
          polarIndex: 0,
          data: contributionT.map((item: number) => {
            return item;
          }),
          type: 'bar',
          coordinateSystem: 'polar',
          label: {
            show: false,
          },
        },
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: ['45%', '69%'],
          center: ['50%', '50%'],
          startAngle: 0,
          roseType: 'area',
          itemStyle: {
            borderRadius: 8,
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            position: 'inside',
          },
          data: contributionM.map((item: number, index: number) => {
            return { value: Math.abs(item), name: ATTR[index] };
          }),
        },
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'circular',
          center: ['50%', '50%'],
          zoom: 0.52,
          emphasis: {
            // itemStyle: {
            //   color: '#000',
            // },
            lineStyle: {
              color: '#000',
            },
          },
          itemStyle: {
            opacity: 0,
          },
          circular: {
            rotateLabel: false,
          },
          legendHoverLink: true,
          data: nodes,
          links: links,
          roam: true,
          label: {
            position: 'right',
            formatter: '{b}',
          },
          lineStyle: {
            color: 'source',
            cap: 'round',
            curveness: 0.1,
          },
          tooltip: {
            trigger: 'item',
            position: 'top',
            textStyle: {
              fontSize: 10,
              lineHeight: 12,
            },
            formatter: (params: any) => {
              const { source, target, lineStyle } = params.data;
              return `${source}-${target}<br/>${lineStyle.width.toFixed(2)}`;
            },
          },
        },
      ],
    });
    getContibution([]);
  }, []);
  return <div ref={chartDom} style={{ width: '100%', height: '100%' }}></div>;
};

export default Vector;
