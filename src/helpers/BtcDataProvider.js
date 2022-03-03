import accessConfig from "./accessConfig.json";

class BtcDataProvider {
  constructor() {
    this.apiKey = accessConfig.apiKey;
  }

  #createGetParams = (obj) => {
    return Object.keys(obj)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      )
      .join("&");
  };

  getHistoryData = async (coin, limit) => {
    const body = {
      fsym: coin,
      tsym: "USD",
      limit: limit,
    };

    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histominute?${this.#createGetParams(
        body
      )}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return data;
  };
}

export default BtcDataProvider;
