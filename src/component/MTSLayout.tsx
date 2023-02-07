import { Col, Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getTest } from '../api/interface';
import Box from './box';
import Cluster from './Cluster';
import Line from './Line';

const MyLayout: React.FC<{}> = () => {
  useEffect(() => {
    getTest().then((dataset: any) => {
      console.log(dataset);
    });
  }, []);
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Layout>
        <Row style={{ height: '65vh', overflow: 'hidden' }}>
          <Col span={4} style={{ height: '100%' }}>
            <Row style={{ height: '100%' }}>
              <Box title='Control' />
            </Row>
          </Col>
          <Col span={10} style={{ height: '100%' }}>
            <Box title='Line' component={<Line/>}/>
          </Col>
          <Col span={10} style={{ height: '100%' }}>
            <Box title='Cluster' component={<Cluster/>}/>
          </Col>
        </Row>
        <Row style={{ height: '35vh', overflow: 'hidden' }}>
          <Col span={12}>
            <Box title='xxx' />
          </Col>
          <Col span={12}>
            <Box title='xxx' />
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default MyLayout;
