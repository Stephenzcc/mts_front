import React, { useCallback, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useUpdateEffect } from 'react-use';
import { getDiscords, getDRTM, getHull, getScatter } from '../api/interface';
import { ATTR, CLUSTER_COLOR, COLOR, DATE } from '../utils/color';

type Props = {
  selectOptions: any;
  selectIndex: any;
  setSelectIndex: any;
};

/**
 * @param props
 * @returns
 */
const Cluster: React.FC<Props> = (props) => {
  const { selectOptions, selectIndex, setSelectIndex } = props;

  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [option, setOption]: any[] = useState({});
  const [scatterData, setScatterData]: any[] = useState([]);
  const [drtData, setDrtData]: any[] = useState([]);
  const [drmData, setDrmData]: any[] = useState([]);
  const [areaData, setAreaData]: any[] = useState([]);

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
            fill: color,
            stroke: echarts.color.lift(color, 1),
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
    getScatter().then((res: any) => {
      console.log(res['scatter'][0][2])
      setScatterData(res['scatter']);
    });
    getDRTM().then((res: any) => {
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
    return (): void => {
      echarts.dispose(instance.current);
    };
  }, [chartDom]);

  // 选中散点时触发
  useEffect(() => {
    if (selectIndex.length) {
      const pointSet = [];
      for (let index of selectIndex) {
        pointSet.push(scatterData[index]);
      }

      getHull(pointSet, 0.5).then((res: any) => {
        console.log(res['hull']);
        setAreaData((prev: any) => {
          return [...prev, ...res['hull']];
        });
      });
    }
  }, [selectIndex, selectOptions]);

  // option改变
  useEffect(() => {
    if (option) {
      if (instance.current) {
        instance.current.hideLoading();
        instance.current.setOption(option);
        instance.current.on('brushSelected', function (params: any) {
          const index = params.batch[0].selected[0].dataIndex;
          setSelectIndex(index);
        });
      }
    }
  }, [option]);

  // 散点数据更新
  useUpdateEffect(() => {
    const series: any[] = [...option.series];
    series[0].data = scatterData;
    series[2].data = drtData;
    series[3].data = drmData;
    // console.log(option);
    setOption({ ...option, series });
  }, [scatterData, drtData, drmData]);

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
        pieces: CLUSTER_COLOR.map((item: string, index: number)=>{
          return {value: index, label: `cluster${index}`, color: item}
        }).slice(0, 8),
        realtime: false,
        align: 'top'
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
          dataZoom: { type: 'inside' },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: (params: any) => {
              console.log(params.dataIndex)
              return `${ATTR[params.dataIndex]}`;
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
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: (params: any) => {
              return `${DATE[params.dataIndex]}`;
            },
          },
        },
      ],
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return `${params['data'][0]},${params['data'][1]}`;
        },
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
        brushMode: 'multiple',
        throttleType: 'debounce',
        throttleDelay: 1000,
        inBrush: {},
        outOfBrush: {},
      },
      dataZoom: { type: 'inside' },
    });
    getScatterData();
  }, []);
  return <div ref={chartDom} style={{ width: '100%', height: '100%' }}></div>;
};

export default Cluster;
