import * as React from "react";

export class HelloWorld extends React.Component<{}, { count: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      count: 0,
    };
    this.myClick = this.myClick.bind(this);
  }
  public render() {
    return (
      <div className="app">
        <h1>Hello world {this.state.count}</h1>
        <button onClick={this.myClick}>COUNT UP</button>
      </div>
    );
  }
  private myClick() {
    this.setState({ count: this.state.count + 1 });
  }
}
