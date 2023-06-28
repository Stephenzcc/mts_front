import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getFeature } from '../api/interface';
import { useUpdateEffect } from 'react-use';

/**
 * @param props
 * @returns
 */
const Feature: React.FC = (props) => {
  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [option, setOption] = useState<any>({});
  // 数据
  const [data, setData] = useState<number[][][]>([]);
  // x坐标轴
  const [xIndex, setXIndex] = useState<string[][]>([]);
  // y坐标轴
  const [yIndex, setYIndex] = useState<number[]>([]);
  // y坐标轴
  const [max, setMax] = useState<number>(1);
  // y坐标轴
  const [min, setMin] = useState<number>(0);

  const getEmbedding = () => {
    getFeature().then((res: any) => {
      const { feature, xIndex: x, yIndex: y, max: mx, min: mn } = res;
      setData(feature);
      setXIndex(x);
      setYIndex(y);
      setMax(mx);
      setMin(mn);
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
  useEffect(() => {
    if (option && instance.current) {
      instance.current.hideLoading();
      instance.current.setOption(option);
    }
  }, [option]);

  // 数据更新
  useUpdateEffect(() => {
    const series: any[] = [...option.series];
    const xAxis: any[] = [...option.xAxis];
    const yAxis: any[] = [...option.yAxis];
    const visualMap: any = { ...option.visualMap };
    data.forEach((value, index) => {
      series[index].data = value;
    });
    xIndex.forEach((value, index) => {
      xAxis[index].data = value;
    });
    xIndex.forEach((value, index) => {
      yAxis[index].data = yIndex;
    });
    visualMap.min = min;
    visualMap.max = max;
    // console.log(option);
    setOption({ ...option, series, xAxis, yAxis, visualMap });
  }, [data]);

  // 初始化option
  useEffect(() => {
    setOption({
      grid: [
        { left: '3%', top: '1%', width: '96%', height: '15%' },
        { left: '3%', top: '17.6%', width: '96%', height: '15%' },
        { left: '3%', top: '34.2%', width: '96%', height: '15%' },
        { left: '3%', bottom: '34.2%', width: '96%', height: '15%' },
        { left: '3%', bottom: '17.6%', width: '96%', height: '15%' },
        { left: '3%', bottom: '1%', width: '96%', height: '15%' },
      ],
      tooltip: {
        trigger: 'axis',
        show: true,
        formatter: (params: any) => {
          return `${params[0].value[3]}`;
        },
      },
      xAxis: new Array(6).fill(0).map((item, index) => {
        return {
          show: false,
          gridIndex: index,
          type: 'category',
          data: [],
        };
      }),
      yAxis: new Array(6).fill(0).map((item, index) => {
        return {
          show: false,
          gridIndex: index,
          type: 'category',
          data: [],
        };
      }),
      visualMap: {
        min: 0,
        max: 0,
        top: '30%',
        itemWidth: 10,
        calculable: true,
        realtime: false,
        dimension: 2,
        inRange: {
          color: [
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
      },
      series: new Array(6).fill(0).map((item, index) => {
        return {
          type: 'heatmap',
          data: [],
          xAxisIndex: index,
          yAxisIndex: index,
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1,
            },
          },
          progressive: 1000,
          animation: false,
        };
      }),
      dataZoom: new Array(6).fill(0).map((item, index) => {
        return { type: 'inside', xAxisIndex: index, filterMode: 'none' };
      }),
    });
    getEmbedding();
  }, []);

  return (
    <>
      <div ref={chartDom} style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default Feature;
