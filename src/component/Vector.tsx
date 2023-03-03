import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { ATTR, DATE } from '../utils/color';
import { getContribute } from '../api/interface';
import { useUpdateEffect } from 'react-use';

type Props = {};

/**
 * @param props
 * @returns
 */
const Vector: React.FC<Props> = (props) => {
  // const {} = props;

  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [contributionT, setContributionT] = useState<number[]>([])
  const [contributionM, setContributionM] = useState<number[]>([])
  const [option, setOption]: any = useState({});

  // 获取数据
  const getContibution = ()=>{
    getContribute().then((res: any)=>{
      const {contributionT: t, contributionM: m} = res
      setContributionT(t)
      setContributionM(m)
    })
  }

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
    if (option) {
      if (instance.current) {
        instance.current.hideLoading();
        instance.current.setOption(option);
      }
    }
  }, [option]);

  // 散点数据更新
  useUpdateEffect(() => {
    const series: any[] = [...option.series];
    series[0].data = contributionT.map((item: number)=>{
      return item
    });
    series[1].data = contributionM.map((item: number, index: number)=>{
      return {value: item, name: ATTR[index]}
    });
    setOption({ ...option, series });
  }, [contributionT, contributionM]);

  // 初始化option
  useEffect(() => {
    setOption({
      polar: [
        {
          radius: ['60%', '80%'],
        },
      ],
      angleAxis: {
        type: 'category',
        axisLine: { 
          show: false 
        },
        axisTick: {
          show: true,
          interval: 30,
        },
        axisLabel: {
          show: true,
          interval: 30,
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
          data: contributionT.map((item: number)=>{
            return item
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
          radius: ['10%', '50%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 8,
          },
          label: {
            show: true,
            position: 'inside',
          },
          data: contributionM.map((item: number, index: number)=>{
            return {value: item, name: ATTR[index]}
          }),
        },
      ],
    });
    getContibution()
  }, []);
  return <div ref={chartDom} style={{ width: '100%', height: '100%', marginBottom: '20%' }}></div>;
};

export default Vector;
