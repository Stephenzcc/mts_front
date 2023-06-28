import { Col, Form, InputNumber, Layout, Row, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { Button, Drawer, FloatButton } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import Box from './box';
import Cluster from './Cluster';
import Feature from './Feature';
import Gantt from './Gantt';
import Line from './Line';
import ChinaMap from './ChinaMap';
import Vector from './Vector';
import { getSimilarity } from '../api/interface';
import Similarity from './Similarity';

const optionList = [
  { label: 'PM2.5', value: 'PM2.5' },
  { label: 'PM10', value: 'PM10' },
  { label: 'SO2', value: 'SO2' },
  { label: 'NO2', value: 'NO2' },
  { label: 'CO', value: 'CO' },
  { label: 'O3', value: 'O3' },
  { label: 'U', value: 'U' },
  { label: 'V', value: 'V' },
  { label: 'TEMP', value: 'TEMP' },
  { label: 'RH', value: 'RH' },
  { label: 'PSFC', value: 'PSFC' },
];

const MyLayout: React.FC<{}> = () => {
  // 打开抽屉
  const [open, setOpen] = useState<boolean>(true);
  // 异常点数据
  const [discords, setDiscords] = useState<string[][]>([]);
  // 选择的污染指标
  const [selectOptions, setSelectOptions] = useState<string[]>(['PM2.5']);
  // 折线图是否标准化
  const [isNorm, setIsNorm] = useState<boolean>(false);
  // 选择的污染指标
  const [nCluster, setNCluster] = useState<number>(7);
  // 选择的污染指标
  const [nPerplexity, setNPerplexity] = useState<number>(60);
  // 选择的污染指标
  const [tPerplexity, setTPerplexity] = useState<number>(20);
  // 选择的污染指标
  const [mPerplexity, setMPerplexity] = useState<number>(2);
  // matrixprofile的windows大小
  const [windows, setWindows] = useState<number>(7);
  // trend的windows大小
  const [trendWindow, setTrendWindow] = useState<number>(15);
  // 选中数据的index
  const [selectIndex, setSelectIndex] = useState<number[]>([174]);
  // 计算HULL的alpha值
  const [alpha, setAlpha] = useState<number>(1);
  // 涟漪效果省
  const [effectScatterP, setEffectScatterP] = useState<string[]>([]);
  // 涟漪效果市
  const [effectScatter, setEffectScatter] = useState<string[]>([]);

  // 关闭抽屉
  const onCloseDrawer = () => {
    setOpen(false);
  };

  // 完成表单，更新state
  const onFinish = (values: any) => {
    console.log('Success:', values);
    const {
      norm,
      alpha,
      attribution,
      windows,
      trend,
      nCluster,
      nPerplexity,
      tPerplexity,
      mPerplexity,
    } = values;
    setSelectOptions(attribution ? attribution : ['PM2.5']);
    setIsNorm(norm ? norm : false);
    setAlpha(alpha ? alpha : 0.3);
    setWindows(windows ? windows : 7);
    setTrendWindow(trend ? trend : 15);
    setNCluster(nCluster ? nCluster : 7);
    setNPerplexity(nPerplexity ? nPerplexity : 60);
    setTPerplexity(tPerplexity ? tPerplexity : 20);
    setMPerplexity(mPerplexity ? mPerplexity : 2);
  };

  // 表单错误
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {}, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <FloatButton
        icon={<FileTextOutlined />}
        style={{ right: 24 }}
        onClick={() => setOpen(true)}></FloatButton>
      <Layout>
        <Row>
          <Col span={12}>
            <Row style={{ height: '62vh', overflow: 'hidden' }}>
              <Col span={24} style={{ height: '100%' }}>
                <Box
                  title='MTS DR into N T M'
                  component={
                    <Cluster
                      selectOptions={selectOptions}
                      alpha={alpha}
                      selectIndex={selectIndex}
                      setSelectIndex={setSelectIndex}
                      nCluster={nCluster}
                      nPerplexity={nPerplexity}
                      tPerplexity={tPerplexity}
                      mPerplexity={mPerplexity}
                      effectScatter={effectScatter}
                      effectScatterP={effectScatterP}
                    />
                  }
                />
              </Col>
            </Row>
            <Row style={{ height: '38vh', overflow: 'hidden' }}>
              <Col span={14}>
                <Box
                  title='Map'
                  component={
                    <ChinaMap
                      selectIndex={selectIndex}
                      setEffectScatter={setEffectScatter}
                      setEffectScatterP={setEffectScatterP}
                    />
                  }
                />
              </Col>
              <Col span={10}>
                <Box
                  title='DR Contribution & M Correlation'
                  component={<Vector selectIndex={selectIndex} />}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row style={{ height: '35vh', width: '100%', overflow: 'hidden' }}>
              <Col span={24}>
                <Box
                  title='MTS Value'
                  component={
                    <Line
                      isNorm={isNorm}
                      discords={discords}
                      setDiscords={setDiscords}
                      selectOptions={selectOptions}
                      selectIndex={selectIndex}
                      windows={windows}
                    />
                  }
                />
              </Col>
            </Row>
            <Row style={{ height: '27vh', width: '100%', overflow: 'hidden' }}>
              <Col span={7} style={{ height: '100%' }}>
                <Box
                  title='N Similarity & N Correlation'
                  component={<Similarity selectIndex={selectIndex} />}
                />
              </Col>
              <Col span={17} style={{ height: '100%' }}>
                <Box
                  title='MTS Trend'
                  component={
                    <Gantt
                      selectIndex={selectIndex}
                      trendWindow={trendWindow}
                    />
                  }
                />
              </Col>
            </Row>
            <Row style={{ height: '38vh', width: '100%', overflow: 'hidden' }}>
              <Col span={24}>
                <Box title='MTS Embedding' component={<Feature />} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>

      <Drawer
        title='Controller'
        placement='right'
        mask={true}
        open={open}
        width={500}
        onClose={onCloseDrawer}>
        <Form
          name='basic'
          labelCol={{ span: 6 }}
          labelAlign={'left'}
          labelWrap={true}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'>
          <Form.Item
            label='Attr:'
            name='attribution'
            rules={[{ required: true, message: 'Please select attr!' }]}>
            <Select
              mode='multiple'
              allowClear
              placeholder='Please select'
              defaultValue={['PM2.5']}
              options={optionList}
            />
          </Form.Item>
          <Form.Item label='Normalized:' name='norm'>
            <Switch />
          </Form.Item>
          <Form.Item label='Alpha:' name='alpha'>
            <InputNumber min={0} max={10} defaultValue={alpha} />
          </Form.Item>
          <Form.Item label='N cluster:' name='nCluster'>
            <InputNumber min={2} max={30} defaultValue={nCluster} />
          </Form.Item>
          <Form.Item label='N perplexity:' name='nPerplexity'>
            <InputNumber min={0} max={100} defaultValue={nPerplexity} />
          </Form.Item>
          <Form.Item label='T perplexity:' name='tPerplexity'>
            <InputNumber min={0} max={100} defaultValue={tPerplexity} />
          </Form.Item>
          <Form.Item label='M perplexity:' name='mPerplexity'>
            <InputNumber min={0} max={100} defaultValue={mPerplexity} />
          </Form.Item>
          <Form.Item label='Anom Window Size:' name='windows'>
            <InputNumber min={4} max={300} defaultValue={windows} />
          </Form.Item>
          <Form.Item label='Trend Window Size:' name='trend'>
            <InputNumber min={2} max={365} defaultValue={trendWindow} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default MyLayout;
