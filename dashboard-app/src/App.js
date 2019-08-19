import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Row, Col, Card, Layout, Spin, Statistic, Table } from "antd";
import "antd/dist/antd.css";
import "./index.css";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Chart, Axis, Tooltip, Geom, Coord, Legend } from "bizcharts";
import moment from "moment";
import Map from "./components/map";

const AppLayout = ({ children }) => (
  <Layout>
    <Layout.Header>
      <div
        style={{
          float: "left"
        }}
      >
        <h2
          style={{
            color: "#fff",
            margin: 0,
            marginRight: "1em"
          }}
        >
          My Dashboard
        </h2>
      </div>
    </Layout.Header>
    <Layout.Content
      style={{
        padding: "0 25px 25px 25px",
        margin: "25px"
      }}
    >
      {children}
    </Layout.Content>
  </Layout>
);

const Dashboard = ({ children }) => (
  <Row type="flex" justify="space-around" align="top" gutter={24}>
    {children}
  </Row>
);

const DashboardItem = ({ children, title }) => (
  <Col span={24} lg={12}>
    <Card
      title={title}
      style={{
        marginBottom: "24px"
      }}
    >
      {children}
    </Card>
  </Col>
);

const numberRender = ({ resultSet }) => (
  <Row
    type="flex"
    justify="center"
    align="middle"
    style={{
      height: "100%"
    }}
  >
    <Col>
      {resultSet.seriesNames().map(s => (
        <Statistic key={s.key} value={resultSet.totalRow()[s.key]} />
      ))}
    </Col>
  </Row>
);

const API_URL = "http://localhost:4000";
const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjU2NjQ2NjEsImV4cCI6MTU2NTc1MTA2MX0.50ci7g7aBowv8TqBSQFdsu33a8QSR6nPS_V0nFIvSCI",
  {
    apiUrl: API_URL + "/cubejs-api/v1"
  }
);

const renderChart = Component => ({ resultSet, error }) =>
  (resultSet && <Component resultSet={resultSet} />) ||
  (error && error.toString()) || <Spin />;

const stackedChartData = resultSet => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(xValues, ", "),
        color: resultSet.axisValuesString(yValues, ", "),
        measure: m && Number.parseFloat(m)
      }))
    )
    .reduce((a, b) => a.concat(b));
  return data;
};

const pieRender = ({ resultSet }) => {
  return (
    <Chart height={400} data={resultSet.chartPivot()} forceFit>
      <Coord type="theta" radius={0.75} />
      {resultSet.seriesNames().map(s => (
        <Axis name={s.key} />
      ))}
      <Legend position="right" />
      <Tooltip />
      {resultSet.seriesNames().map(s => (
        <Geom type="intervalStack" position={s.key} color="category" />
      ))}
    </Chart>
  );
};

const tableRender = ({ resultSet }) => {
  console.log("ResultSet=", resultSet.loadResponse.data);
  return (
    <Table
      pagination={false}
      columns={resultSet.tableColumns().map(c => ({ ...c, dataIndex: c.key }))}
      dataSource={resultSet.tablePivot()}
    />
  );
};

const mapRender = ({resultSet}) => {
  const defaultCenter = {lat: 39.833333, lng: -98.583333}
  let markerArray = [];
  markerArray.push(defaultCenter);
  console.log("ResultSet=", resultSet.loadResponse.data);
  return (
    <Map 
      center={defaultCenter}
      defaultZoom={4}
      markers={resultSet.loadResponse.data}
    />
  );
}

function App() {
  return (
    <div className="App">
      <AppLayout>
        <Dashboard>
          <DashboardItem>
            <QueryRenderer
              query={{
                measures: ["Orders.totalAmount"],
                timeDimensions: [],
                filters: []
              }}
              cubejsApi={cubejsApi}
              render={renderChart(numberRender)}
            />
          </DashboardItem>
          <DashboardItem>
            <QueryRenderer
              query={{
                measures: [
                  "Orders.totalAmount",
                  "Orders.totalAmount",
                  "Orders.count",
                  "Orders.count"
                ],
                timeDimensions: [],
                filters: []
              }}
              cubejsApi={cubejsApi}
              render={renderChart(numberRender)}
            />
          </DashboardItem>
          <DashboardItem>
            <QueryRenderer
              query={{
                measures: ["Zips.count"],
                timeDimensions: [],
                dimensions: ["Zips.state"],
                filters: []
              }}
              cubejsApi={cubejsApi}
              render={renderChart(pieRender)}
            />
          </DashboardItem>
          
          <DashboardItem>
            <QueryRenderer
              query={{
                filters: [
                  {
                    dimension: "Zips.city",
                    operator: "contains",
                    values: ["AA"]
                  }
                ],
                dimensions: ["Zips.city"],
                timeDimensions: []
              }}
              cubejsApi={cubejsApi}
              render={renderChart(mapRender)}
            />
          </DashboardItem>
        </Dashboard>
      </AppLayout>
    </div>
  );
}

export default App;
