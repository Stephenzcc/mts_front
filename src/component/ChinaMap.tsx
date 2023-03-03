import React, { useCallback, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useUpdateEffect } from 'react-use';
import china from '../assets/china.json';
import beijing from '../assets/beijing.json';

//@ts-ignore
echarts.registerMap('china', { geoJSON: china });

/**
 * @param props
 * @returns
 */
const ChinaMap: React.FC = (props) => {
  const chartDom = React.useRef<any>();
  const instance = React.useRef<any>();
  const [option, setOption]: any[] = useState({});

  // 下钻
  const enterProv = () => {
    instance.current.hideLoading();
    instance.current.on('click', ({ name }: any) => {
      if (name === '北京市') {
        setOption({
          ...option,
          geo: { ...option.geo, zoom: 0.8, map: 'beijing' },
        });
        // 注册地图
        //@ts-ignore
        echarts.registerMap('beijing', { geoJSON: beijing });
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
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          // 鼠标放上去的样式
          emphasis: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        roam: true,
        zoom: 1.5,
        // 地图区域的样式设置
        itemStyle: {
          borderColor: 'rgba(248, 190, 159, 1)',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(248, 190, 159, 0)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(248, 190, 159, 0.2)', // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          shadowColor: 'rgba(248, 190, 159, 1)',
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10,
          // 鼠标放上去高亮的样式
        },
        emphasis: {
          itemStyle: {
            areaColor: '#389BB7',
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
            return Math.log2(value[2] * 100);
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
            color: '#36C5F0aa',
            shadowBlur: 2,
            shadowColor: 'D8BC37',
            opacity: 0.8,
          },
          // 数据格式，其中name,value是必要的，value的前两个值是数据点的经纬度，其他的数据格式可以自定义
          // 至于如何展示，完全是靠上面的formatter来自己定义的
          data: [
            { name: '西藏市', value: [91.23, 29.5, 1] },
            { name: '黑龙江', value: [128.03, 47.01, 2] },
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
