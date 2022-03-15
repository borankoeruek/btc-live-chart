import React, { Component } from "react";
import Plot from "react-plotly.js";
import CryptoDataProvder from "./helpers/CryptoDataProvider";
import { Col, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  constructor() {
    super();
    this.cryptoDataProvder = new CryptoDataProvder();

    this.state = {
      chartDates: [],
      chartPrices: [],
    };
  }

  componentDidMount = async () => {
    await this.loadBtcHistoryData();
    this.startIntervalFetcher();
  };

  loadBtcHistoryData = async () => {
    const response = await this.cryptoDataProvder.getHistoryData("BTC", 90);

    console.log(response);

    const data = response.Data.Data;
    let chartDates = [];
    let chartPrices = [];

    data.forEach((item) => {
      chartDates.push(new Date(item.time * 1000));
      chartPrices.push(item.close);
    });

    this.setState({ chartDates, chartPrices });
  };

  startIntervalFetcher = async () => {
    const ONE_MINUTE_IN_MS = 60000;

    setInterval(async () => {
      // get last Btc history data
      const response = await this.cryptoDataProvder.getHistoryData("BTC", 1);

      const data = response.Data.Data[0];

      console.log(data);

      // if last our record time is >= the last record + 60 seconds
      if (
        data.time * 1000 >=
        +this.state.chartDates[this.state.chartDates.length - 1] + 60000
      ) {
        console.log("Last record changed!");
        const shallowCopyDates = [...this.state.chartDates];
        const shallowCopyPrices = [...this.state.chartPrices];

        shallowCopyDates.push(new Date(data.time * 1000));
        shallowCopyPrices.push(data.close);

        this.setState(
          { chartDates: shallowCopyDates, chartPrices: shallowCopyPrices },
          () => {
            console.log(this.state);
          }
        );
      }
    }, ONE_MINUTE_IN_MS);
  };

  render() {
    return (
      <Container>
        <Row className="mt-5 justify-content-center">
          <Plot
            data={[
              {
                x: this.state.chartDates,
                y: this.state.chartPrices,
                type: "scatter",
                mode: "lines",
              },
            ]}
            layout={{
              font: { size: 14 },
              title: "BTC Live Chart",
            }}
            config={{ responsive: true }}
          />
        </Row>
      </Container>
    );
  }
}

export default App;
