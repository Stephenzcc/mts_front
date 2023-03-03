import { post, get } from './http';

// /**
//  * 根据污染物返回选中散点序号的城市序列csv
//  * @param index 选中点的index
//  * @param attr 属性列表
//  * @returns
//  */
// export const getSeq = (index: any[], attr: any[]) => {
//   return get(`getSeqByAttr?index=${index.join('-')}&attr=${attr.join('-')}`);
// };

/**
 * 获取异常区间
 * @param index 选中点的index
 * @param attr 属性列表
 * @param windows 窗口大小
 * @returns
 */
export const getDiscords = (index: any[], attr: any[], windows: any=7) => {
  return post('getDiscords', { index, attr, windows });
};

/**
 * 删除临时文件
 * @returns
 */
export const deleteCSV = () => {
  return post('deleteCSV', {});
};

/**
 * 返回Hull
 * @param points
 * @param alpha
 * @returns
 */
export const getHull = (points: any[], alpha = 1.0) => {
  return post('computeHull', { points, alpha });
};

/**
 * 获取数据整体趋势
 * @returns
 */
export const getTrend = () => {
  return get('getTrend');
};

/**
 * 获取聚类散点数据
 * @returns 
 */
export const getScatter = () => {
  return get('getScatter');
};

/**
 * 获取两个降维散点图数据
 * @returns
 */
export const getDRTM = () => {
  return get('getDRTM');
};

/**
 * 获取时间和属性维度的贡献值
 * @returns 
 */
export const getContribute = () =>{
  return get('getContribute')
}
