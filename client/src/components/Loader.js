import React, { Component } from "react";
import {
  BarLoader,
  DoubleBubble,
  SlidingPebbles,
  DoubleOrbit,
  Spinner,
} from "react-spinner-animated";

import "react-spinner-animated/dist/index.css";

class Loader extends Component {
  render() {
    return (
      <SlidingPebbles text="Loading..." bgColor={"#F0A500"} center={true} />
    );
  }
}
export default Loader;
