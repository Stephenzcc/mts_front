import React, { useCallback, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useUpdateEffect } from 'react-use';
import china from '../assets/china.json';
import beijing from '../assets/beijing.json';
import { getMapData } from '../api/interface';

type Props = {
  selectIndex: any;
  setEffectScatter: any;
  setEffectScatterP: any;
};

//@ts-ignore
echarts.registerMap('china', { geoJSON: china });

/**
 * @param props
 * @returns
 */
const ChinaMap: React.FC<Props> = (props) => {
  const { selectIndex, setEffectScatter, setEffectScatterP } = props;
  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [option, setOption] = useState<any>({});
  const timer = React.useRef<any>(null);
  // location散点
  const [location, setLocation] = useState<{ name: string; value: number[] }[]>(
    []
  );

  // 下钻
  const enterProv = () => {
    instance.current.hideLoading();

    instance.current.on('click', function (params: any) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const { name, componentType, data } = params;
        // if (name === '北京市' && componentType === 'geo') {
        //   setOption({
        //     ...option,
        //     geo: { ...option.geo, zoom: 0.8, map: 'beijing' },
        //   });
        //   // 注册地图
        //   //@ts-ignore
        //   echarts.registerMap('beijing', { geoJSON: beijing });
        // }
        if (componentType === 'geo') {
          setEffectScatterP((prev: any) => {
            return [...prev, name];
          });
          setEffectScatter([]);
        }
        if (componentType === 'series') {
          setEffectScatter([data['name']]);
          setEffectScatterP([]);
        }
      }, 500);
    });
    instance.current.on('dblclick', function (params: any) {
      clearTimeout(timer.current);
      const { name, componentType, data } = params;
      if (componentType === 'geo') {
        setEffectScatterP([name]);
        setEffectScatter([]);
      }
    });
  };

  // 返回下钻
  const upChina = () => {
    instance.current.hideLoading();
    instance.current.getZr().on('click', ({ target }: any) => {
      if (!target) {
        setOption({
          ...option,
          geo: { ...option.geo, zoom: 1.5, map: 'china' },
        });
        // 注册地图
        //@ts-ignore
        echarts.registerMap('china', { geoJSON: china });
      }
    });
  };

  // 获取dom初始化echart
  useUpdateEffect(() => {
    instance.current =
      echarts.getInstanceByDom(chartDom.current) ||
      //@ts-ignore
      echarts.init(chartDom.current, null);
    enterProv();
    upChina();
    return (): void => {
      echarts.dispose(instance.current);
    };
  }, [chartDom.current]);

  // option改变
  useUpdateEffect(() => {
    if (option && instance.current) {
      instance.current.setOption(option, true);
    }
  }, [option]);

  // location更新
  useUpdateEffect(() => {
    if (selectIndex.length) {
      getMapData(selectIndex).then((res: any) => {
        const series: any[] = [...option.series];
        console.log(res['location']);
        series[0].data = res['location'];
        setOption({ ...option, series });
      });
    }
  }, [selectIndex]);

  // 初始化
  useEffect(() => {
    setOption({
      backgroundColor: 'transparent',
      title: {
        text: 'AirQuality',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        // ...
        formatter(params: any) {
          return `地区：${params.name}</br>数值：${params.value[2]}`;
        },
      },
      // 地图配置
      geo: {
        map: 'china',
        label: {
          // 通常状态下的样式
          normal: {
            show: false,
            textStyle: {
              color: '#fff',
            },
          },
          // 鼠标放上去的样式
          emphasis: {
            show: false,
            textStyle: {
              color: '#fff',
            },
          },
        },
        roam: true,
        zoom: 1.5,
        // 地图区域的样式设置
        itemStyle: {
          borderColor: '#bbbbbb',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: '#eeeeee44', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#eeeeee88', // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          shadowColor: '#eeeeee',
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10,
        },
        // 鼠标放上去高亮的样式
        emphasis: {
          itemStyle: {
            areaColor: '#999999',
            borderWidth: 0,
          },
        },
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          legendHoverLink: true,
          symbolSize: (value: any) => {
            return Math.log2(value[2] + 1) * 8;
          },
          // 这里渲染标志里的内容以及样式
          // label: {
          //   show: true,
          //   formatter(value: any) {
          //     return value.data.value[2];
          //   },
          //   color: '#fff',
          // },
          // 标志的样式
          itemStyle: {
            color: '#72c1cbdd',
            shadowBlur: 2,
            shadowColor: '#72c1cbdd',
            opacity: 0.8,
          },
          // 数据格式，其中name,value是必要的，value的前两个值是数据点的经纬度，其他的数据格式可以自定义
          // 至于如何展示，完全是靠上面的formatter来自己定义的
          data: [
            { name: '北京市', value: [116.46, 39.92, 6] },
            { name: '上海市', value: [121.48, 31.22, 3] },
          ],
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
          },
          hoverAnimation: true,
          zlevel: 1,
        },
      ],
      graphic: {
        // 水印类型
        type: 'text',
        // 相对于容器的位置
        left: '10%',
        top: '10%',
        // 样式设置
        style: {
          // 文本内容
          text: 'create by cRack_cLick',
          // 字体粗细、大小、字体
          font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
          // 字体颜色
          fill: '#fff',
        },
      },
    });
  }, []);
  return <div ref={chartDom} style={{ width: '100%', height: '100%' }}></div>;
};

export default ChinaMap;
