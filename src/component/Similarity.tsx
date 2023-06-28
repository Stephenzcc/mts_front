import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { ATTR, DATE } from '../utils/color';
import { getContribute, getSimilarity } from '../api/interface';
import { useUpdateEffect } from 'react-use';

type Props = {
  selectIndex: any;
};

/**
 * @param props
 * @returns
 */
const Similarity: React.FC<Props> = (props) => {
  const { selectIndex } = props;

  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [similarity, setSimilarity] = useState<number[][]>([]);
  const [relevance, setRelevance] = useState<number[][]>([]);
  const [option, setOption]: any = useState({});

  // 获取数据
  const getSimi = (index: number[]) => {
    if (index.length > 1) {
      getSimilarity(index).then((res: any) => {
        const { rel, dis } = res;
        setSimilarity(dis);
        let rele: number[][] = [];
        for (let i = 0; i < rel.length; i++) {
          rele = [
            ...rele,
            ...rel[i].map((it: number) => {
              return [it, i];
            }),
          ];
        }
        setRelevance(rele);
      });
    }
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
    if (option && instance.current) {
      instance.current.hideLoading();
      instance.current.setOption(option);
    }
  }, [option]);

  // 框选散点变化
  useUpdateEffect(() => {
    if (selectIndex.length && selectIndex.length < 10) {
      getSimi(selectIndex);
    }
  }, [selectIndex]);

  // 数据更新
  useUpdateEffect(() => {
    const dataset: any[] = [...option.dataset];
    dataset[0].source = similarity;
    const series: any[] = [...option.series];
    series[1].data = relevance;
    setOption({ ...option, dataset, series });
  }, [similarity, relevance]);

  // 初始化option
  useEffect(() => {
    setOption({
      grid: {
        top: '10%',
        bottom: '10%',
        left: '15%',
      },
      tooltip: {},
      yAxis: [
        {
          type: 'category',
          inverse: true,
          data: ATTR,
          splitArea: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
        {
          type: 'category',
          inverse: true,
          data: ATTR,
          show: false,
          splitArea: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
      ],
      xAxis: [
        {
          type: 'value',
          name: '',
          splitArea: {
            show: true,
          },
        },
        {
          type: 'value',
          name: '',
          splitArea: {
            show: true,
          },
        },
      ],
      dataset: [
        {
          source: [],
        },
        {
          transform: {
            type: 'boxplot',
            config: {
              itemNameFormatter: function (params: any) {
                return params.value;
              },
            },
          },
        },
      ],

      series: [
        {
          name: 'boxplot',
          type: 'boxplot',
          datasetIndex: 1,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: '#72c1cb',
          },
          tooltip: {
            trigger: 'item',
            position: 'top',
            textStyle: {
              fontSize: 10,
              lineHeight: 12,
            },
            formatter: (params: any) => {
              const seq = params['data']
                .slice(1)
                .sort((a: number, b: number) => b - a);
              return `max:${seq[0].toFixed(4)}<br/>mid:${seq[
                Math.floor(seq.length / 2)
              ].toFixed(4)}<br/>min:${seq[seq.length - 1].toFixed(4)}`;
            },
            axisPointer: {
              type: 'shadow',
            },
          },
        },
        {
          name: 'Punch Card',
          type: 'scatter',
          data: [],
          xAxisIndex: 1,
          yAxisIndex: 1,
          tooltip: {
            trigger: 'item',
            position: 'top',
            formatter: (params: any) => {
              return `${params.data[0]}`;
            },
            axisPointer: {
              type: 'shadow',
            },
          },
          itemStyle: {
            color: '#d06397',
          },
        },
      ],
    });
    getSimi([1, 2, 3, 4]);
  }, []);
  return <div ref={chartDom} style={{ width: '100%', height: '100%' }}></div>;
};

export default Similarity;
