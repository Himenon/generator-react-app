import * as React from "react";
import * as ReactDOM from "react-dom";
import * as HelloWorld from "../HelloWorld";

test("render test", () => {
  const div = document.createElement("div");
  ReactDOM.render(<HelloWorld.Component name="hello" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
