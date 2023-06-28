import React, { useCallback, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useUpdateEffect } from 'react-use';
import { getDiscords, getDRTM, getHull, getScatter } from '../api/interface';
import { ATTR, CLUSTER_COLOR, COLOR, DATE } from '../utils/color';

type Props = {
  selectOptions: any;
  alpha: number;
  selectIndex: any;
  setSelectIndex: any;
  nCluster: any;
  nPerplexity: any;
  tPerplexity: any;
  mPerplexity: any;
  effectScatterP: string[];
  effectScatter: string[];
};

/**
 * @param props
 * @returns
 */
const Cluster: React.FC<Props> = (props) => {
  const {
    selectOptions,
    alpha,
    selectIndex,
    setSelectIndex,
    nCluster,
    nPerplexity,
    tPerplexity,
    mPerplexity,
    effectScatterP,
    effectScatter,
  } = props;

  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [option, setOption] = useState<any>({});
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [drtData, setDrtData] = useState<any[]>([]);
  const [drmData, setDrmData] = useState<any[]>([]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const timer = React.useRef<any>(null);
  const [computeHull, setComputeHull] = useState<boolean>(false);

  // 渲染自定义
  const renderItem = useCallback(
    (params: any, api: any) => {
      if (params.context.rendered) {
        return;
      }

      params.context.rendered = true;

      let points = [];
      for (let i = 0; i < areaData.length; i++) {
        points.push(
          areaData[i].map((item: any[]) => {
            return api.coord([parseFloat(item[0]), parseFloat(item[1])]);
          })
        );
      }
      let color = api.visual('color');
      const children = [];
      for (let i = 0; i < points.length; i++) {
        children.push({
          type: 'polygon',
          shape: {
            points: echarts.graphic.clipPointsByRect(points[i], {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height,
            }),
          },
          style: api.style({
            fill: '#cccccc66',
            stroke: '#cccccc66',
          }),
        });
      }
      return {
        type: 'group',
        children: children,
      };
    },
    [areaData, option]
  );

  // 获取散点数据
  const getScatterData = () => {
    getScatter(nCluster, nPerplexity).then((res: any) => {
      setScatterData(res['scatter']);
    });
  };

  // 获取降维散点数据
  const getDRScatter = (index: number[], opts: string[]) => {
    const options = opts.map((item: string) => {
      return ATTR.indexOf(item);
    });
    getDRTM(index, options, tPerplexity, mPerplexity).then((res: any) => {
      const { drt, drm } = res;
      setDrtData(drt);
      setDrmData(drm);
    });
  };

  // 获取dom初始化echart
  useEffect(() => {
    instance.current =
      echarts.getInstanceByDom(chartDom.current) ||
      //@ts-ignore
      echarts.init(chartDom.current, null);
    instance.current.on('brushSelected', function (params: any) {
      const index = params.batch[0].selected[0].dataIndex;
      setComputeHull(true);
      if (index.length && selectIndex.toString() !== index.toString()) {
        setSelectIndex(index);
      }
    });
    instance.current.on('click', function (params: any) {
      const index = params.dataIndex;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setComputeHull(false);
        setSelectIndex((prev: number[]) => {
          return [...prev, index];
        });
      }, 500);
    });
    instance.current.on('dblclick', function (params: any) {
      const index = params.dataIndex;
      clearTimeout(timer.current);
      setComputeHull(false);
      setSelectIndex([index]);
    });
    return (): void => {
      echarts.dispose(instance.current);
    };
  }, [chartDom]);

  // 配置项更新
  useUpdateEffect(() => {
    getScatterData();
  }, [nCluster, nPerplexity]);

  // 选中散点时触发 或 DRTM配置更新
  useUpdateEffect(() => {
    if (selectIndex.length) {
      if (computeHull) {
        const pointSet = [];
        for (let index of selectIndex) {
          pointSet.push(scatterData[index]);
        }
        getHull(pointSet, alpha).then((res: any) => {
          console.log(res['hull']);
          setAreaData((prev: any) => {
            return [...prev, ...res['hull']];
          });
        });
      }
      getDRScatter(selectIndex, selectOptions);
    }
  }, [selectIndex, selectOptions, tPerplexity, mPerplexity]);

  // option改变
  useUpdateEffect(() => {
    if (option && instance.current) {
      instance.current.hideLoading();
      instance.current.setOption(option);
    }
  }, [option]);

  // 散点数据更新
  useUpdateEffect(() => {
    const effectData = scatterData.filter((item: any) => {
      return effectScatter.includes(item[4]);
    });
    const effectDataP = scatterData.filter((item: any) => {
      return effectScatterP.includes(item[3]);
    });
    const series: any[] = [...option.series];
    series[0].data = scatterData;
    series[2].data = drtData;
    series[3].data = drmData;
    series[4].data = effectData.length ? effectData : effectDataP;
    // console.log(option);
    setOption({ ...option, series });
  }, [scatterData, drtData, drmData]);

  // 涟漪效果
  useUpdateEffect(() => {
    const effectData = scatterData.filter((item: any) => {
      return effectScatter.includes(item[4]);
    });
    const effectDataP = scatterData.filter((item: any) => {
      return effectScatterP.includes(item[3]);
      // return item[4] === '临汾市';
    });
    const series: any[] = [...option.series];
    series[4].data = effectData.length ? effectData : effectDataP;
    setOption({ ...option, series });
  }, [effectScatter, effectScatterP]);

  // 凹包区域更新
  useUpdateEffect(() => {
    const series: any[] = [...option.series];
    series[1].data = areaData;
    series[1].renderItem = renderItem;
    setOption({ ...option, series });
  }, [areaData]);

  // 初始化option
  useEffect(() => {
    setOption({
      grid: [
        { left: '3%', top: '5%', width: '60%', height: '90%' },
        { right: '3%', top: '5%', width: '30%', height: '43%' },
        { right: '3%', bottom: '5%', width: '30%', height: '43%' },
      ],
      visualMap: {
        type: 'piecewise',
        seriesIndex: 0,
        top: 'auto',
        show: false,
        min: 0,
        max: 8,
        dimension: 2,
        splitNumber: 8,
        pieces: CLUSTER_COLOR.map((item: string, index: number) => {
          return { value: index, label: `cluster${index}`, color: item };
        }).slice(0, 8),
        realtime: false,
        align: 'top',
      },
      series: [
        {
          type: 'scatter',
          data: [],
          xAxisIndex: 0,
          yAxisIndex: 0,
          symbolSize: 10,
          // large: true,
          // largeThreshold: 3000,
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: (params: any) => {
              return `${params.value[3]}/${params.value[4]}/${params.value[5]}`;
            },
          },
        },
        {
          type: 'custom',
          xAxisIndex: 0,
          yAxisIndex: 0,
          renderItem: renderItem,
          data: areaData,
        },
        {
          type: 'scatter',
          data: [],
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 10,
          large: true,
          largeThreshold: 2000,
          itemStyle: {
            color: (params: any) => {
              return ['12-13', '12-19'].includes(DATE[params.dataIndex])
                ? '#72c1cb'
                : '#72c1cb';
            },
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: (params: any) => {
              return `${DATE[params.dataIndex]}`;
            },
          },
        },
        {
          type: 'scatter',
          data: [],
          xAxisIndex: 2,
          yAxisIndex: 2,
          symbolSize: 10,
          large: true,
          largeThreshold: 2000,
          itemStyle: {
            color: '#d06397',
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: (params: any) => {
              return `${ATTR[params.dataIndex]}`;
            },
          },
        },
        {
          type: 'effectScatter',
          symbolSize: 20,
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: [],
          z: 1,
          tooltip: {
            show: false,
          },
          itemStyle: {
            color: '#72c1cbaa',
          },
        },
      ],
      tooltip: {
        position: 'top',
      },
      xAxis: [
        { gridIndex: 0, axisLine: { onZero: false } },
        { gridIndex: 1, axisLine: { onZero: false } },
        { gridIndex: 2, axisLine: { onZero: false } },
      ],
      yAxis: [
        { gridIndex: 0, axisLine: { onZero: false } },
        { gridIndex: 1, axisLine: { onZero: false } },
        { gridIndex: 2, axisLine: { onZero: false } },
      ],
      toolbox: {
        feature: {
          brush: {
            type: ['rect', 'polygon', 'keep', 'clear'],
          },
          dataZoom: {},
        },
      },
      brush: {
        xAxisIndex: 0,
        yAxisIndex: 0,
        seriesIndex: 0,
        brushMode: 'multiple',
        throttleType: 'debounce',
        throttleDelay: 1000,
        inBrush: {},
        outOfBrush: {},
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: 0 },
        { type: 'inside', yAxisIndex: 0 },
        { type: 'inside', xAxisIndex: 1 },
        { type: 'inside', yAxisIndex: 1 },
        { type: 'inside', xAxisIndex: 2 },
        { type: 'inside', yAxisIndex: 2 },
      ],
    });
    getScatterData();
    getDRScatter([], ATTR);
  }, []);
  return <div ref={chartDom} style={{ width: '100%', height: '100%' }}></div>;
};

export default Cluster;
