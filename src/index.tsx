import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import App from "./App";
import { Layout, Row, Col } from "antd";
import { Content } from "antd/lib/layout/layout";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <Layout>
      <Content>
        <Row>
          <Col
            span={10}
            style={{
              backgroundColor: "red",
              height: "200px",
            }}
          ></Col>

          <Col
            span={10}
            style={{
              backgroundColor: "blue",
              height: "200px",
            }}
          ></Col>
        </Row>
        <Row>
          <Col
            span={10}
            style={{
              backgroundColor: "yellow",
              height: "200px",
            }}
          ></Col>
          <Col
            span={10}
            style={{
              backgroundColor: "green",
              height: "200px",
            }}
          ></Col>
        </Row>
      </Content>
    </Layout>
  </React.StrictMode>
);
