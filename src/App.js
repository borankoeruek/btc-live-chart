import React, { Component } from "react";
import Plot from "react-plotly.js";
import "./css/app.css";
import BtcDataProvder from "./helpers/BtcDataProvider";

class App extends Component {
  constructor() {
    super();
    this.btcDataProvder = new BtcDataProvder();

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
    const response = await this.btcDataProvder.getHistoryData("BTC", 50);

    console.log(response);

    const data = response.Data.Data;
    let chartDates = [];
    let chartPrices = [];

    for (let x = 0; x < data.length; x++) {
      chartDates.push(new Date(data[x].time * 1000));
      chartPrices.push(data[x].close);
    }

    this.setState({ chartDates, chartPrices });
  };

  startIntervalFetcher = async () => {
    // get last Btc history data

    setInterval(async () => {
      const response = await this.btcDataProvder.getHistoryData("BTC", 1);

      const data = response.Data.Data[0];

      // if last ur record time is the time from the last record + 60 seconds
      if (
        +new Date(data.time) ===
        +this.state.chartDates[this.state.chartDates.length - 1] + 60
      ) {
        console.log("Last record changed!");
        const shallowCopyDates = [...this.state.chartDates];
        const shallowCopyPrices = [...this.state.chartPrices];

        shallowCopyDates.push(new Date(data.time * 1000));
        shallowCopyPrices.push(data.close);
        // add item to sate

        this.setState(
          { chartDates: shallowCopyDates, chartPrices: shallowCopyPrices },
          () => {
            console.log(this.state);
          }
        );
      }
    }, 10000);
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "95vh",
        }}
      >
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
          //config={{ responsive: true }}
        />
      </div>
    );
  }
}

export default App;
