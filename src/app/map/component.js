import React, { Component } from "react";
import testHeatmapData from "./testHeatmap.json";

import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

export default class MyMap extends Component {
  constructor(props) {
    super(props);
    this.geoJSONUrl = "https://metservice-api.herokuapp.com/rainfall.geojson";

    this.accessToken =
      "pk.eyJ1IjoidGhldGVhcG90IiwiYSI6ImNqc2ppcmt6NjBlZjg0NG9ueHhibXBibTEifQ.-WN8VYdzAJf7j8BzKvyLyQ";
    this.Map = ReactMapboxGl({
      accessToken: this.accessToken
    });
    this.state = {
      geoJSON: { features: [] }
    };
    this.heatmapPaint = {
      "heatmap-weight": {
        property: "amountOfPrecipitation",
        type: "exponential",
        stops: [[0, 0], [20, 1]]
      },
      // Increase the heatmap color weight weight by zoom level
      // heatmap-ntensity is a multiplier on top of heatmap-weight
      // "heatmap-intensity": {
      //   stops: [[0, 0], [5, 1.2]]
      // },
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.25,
        "rgb(103,169,207)",
        0.5,
        "rgb(209,229,240)",
        0.8,
        "rgb(253,219,199)",
        1,
        "rgb(239,138,98)",
        2,
        "rgb(178,24,43)"
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": {
        stops: [[0, 1], [5, 50]]
      }
    };
  }

  async componentDidMount() {
    let geoJSON = await (await fetch(this.geoJSONUrl)).json();
    console.log(geoJSON);
    this.setState({ geoJSON });
  }

  render() {
    console.log(this.state.geoJSON);

    return (
      <this.Map
        style="mapbox://styles/mapbox/streets-v9"
        zoom={[4]}
        // maxBounds={[[150, -47], [-178, -32]]}
        fitBounds={[[149, -46], [-177, -31]]}
        center={[174, -41]}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      >
        <Layer type="heatmap" paint={this.heatmapPaint}>
          {this.state.geoJSON.features.map((el, index) => {
            let [lat, lng] = el.geometry.coordinates;
            console.log([Number(lat), Number(lng)]);

            return (
              <Feature
                key={index}
                coordinates={[Number(lat), Number(lng)]}
                properties={el}
              />
            );
          })}
        </Layer>
      </this.Map>
    );
  }
}
