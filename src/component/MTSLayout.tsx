import { Col, Form, InputNumber, Layout, Row, Select } from 'antd';
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
  const [discords, setDiscords] = useState<any[]>([]);
  // 选择的污染指标
  const [selectOptions, setSelectOptions] = useState<any[]>(['PM2.5']);
  // matrixprofile的windows大小
  const [windows, setWindows] = useState<number>(7)
  // 选中数据的index
  const [selectIndex, setSelectIndex]: any[] = useState([1]);

  // 关闭抽屉
  const onCloseDrawer = () => {
    setOpen(false);
  };

  // 完成表单，更新state
  const onFinish = (values: any) => {
    console.log('Success:', values);
    setSelectOptions(values['attribution']);
    setWindows(values['windows']);
  };

  // 表单错误
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

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
                  title='Cluster'
                  component={
                    <Cluster
                      selectOptions={selectOptions}
                      selectIndex={selectIndex}
                      setSelectIndex={setSelectIndex}
                    />
                  }
                />
              </Col>
            </Row>
            <Row style={{ height: '38vh', overflow: 'hidden' }}>
              <Col span={14}>
                <Box title='Map' component={<ChinaMap />} />
              </Col>
              <Col span={10}>
                <Box title='Vector' component={<Vector />} />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row style={{ height: '35vh', width: '100%', overflow: 'hidden' }}>
              <Col span={24}>
                <Box
                  title='Line'
                  component={
                    <Line
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
              <Col span={24} style={{ height: '100%' }}>
                <Box title='Gantt' component={<Gantt />} />
              </Col>
            </Row>
            <Row style={{ height: '38vh', width: '100%', overflow: 'hidden' }}>
              <Col span={24}>
                <Box title='Feature' component={<Feature />} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>

      <Drawer
        title='Basic Drawer'
        placement='right'
        mask={true}
        open={open}
        width={500}
        onClose={onCloseDrawer}>
        <Form
          name='basic'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'>
          <Form.Item
            label='Attr:'
            name='attribution'
            rules={[
              { required: true, message: 'Please select attr!' },
            ]}>
            <Select
              mode='multiple'
              allowClear
              placeholder='Please select'
              defaultValue={['PM2.5']}
              options={optionList}
            />
          </Form.Item>
          <Form.Item
            label='Windows:'
            name='windows'
            rules={[
              { required: true, message: 'Please input windows!' },
            ]}>
            <InputNumber
              min={1}
              max={365}
              defaultValue={7}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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
