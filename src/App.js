import React, { Component } from "react";
import Plot from "react-plotly.js";
import "./css/app.css";
class App extends Component {
  state = {};

  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plot
          data={[
            {
              x: [1, 2, 3],
              y: [2, 6, 3],
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            },
            { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
          ]}
          layout={{
            width: 700,
            height: 400,
            autosize: true,
            title: "BTC Live Chart",
          }}
        />
      </div>
    );
  }
}

export default App;
