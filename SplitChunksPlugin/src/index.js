import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import common from "./common";

console.log(1, React, ReactDOM);
console.log(2, common);

setTimeout(() => {
  import("./async-module").then(({ default: common }) => {
    console.log(3, common);
  });
}, 2000);
