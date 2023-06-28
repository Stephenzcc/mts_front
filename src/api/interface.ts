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
export const getDiscords = (index: any[], attr: any[], windows: any = 7) => {
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
 * 返回选中散点在地图上的位置
 * @param index 选中散点index
 * @returns
 */
export const getMapData = (index: number[]) => {
  return post('getMapData', { index });
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
export const getTrend = (window: number, index: any[]) => {
  return post('getTrend', { window, index });
};

/**
 * 获取聚类散点数据
 * @param nClusters
 * @param perplexity
 * @returns
 */
export const getScatter = (nClusters: number, perplexity: number) => {
  return post('getScatter', { nClusters, perplexity });
};

/**
 * 获取两个降维散点图数据
 * @param index
 * @param perplexityT
 * @param perplexityM
 * @returns
 */
export const getDRTM = (
  index: number[],
  options: number[],
  perplexityT: number,
  perplexityM: number
) => {
  return post('getDRTM', { index, options, perplexityT, perplexityM });
};

/**
 * 获取时间和属性维度的贡献值
 * @returns
 */
export const getContribute = (index: number[]) => {
  return post('getContribute', { index });
};

/**
 * 获取嵌入特征
 * @returns
 */
export const getFeature = () => {
  return get('getFeature');
};

/**
 * 获取所选样本间两两之间的每个属性相似度
 * @param index 
 * @returns 
 */
export const getSimilarity = (index: number[]) => {
  return post('getSimilarity', { index });
};
