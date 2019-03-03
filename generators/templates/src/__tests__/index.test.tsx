import * as React from "react";
import * as ReactDOM from "react-dom";
import { HelloWorld } from "../HelloWorld";

test("render test", () => {
  const div = document.createElement("div");
  ReactDOM.render(<HelloWorld />, div);
  ReactDOM.unmountComponentAtNode(div);
});
