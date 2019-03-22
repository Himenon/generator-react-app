import * as React from "react";
const styles = require("./style.scss");

interface HelloWorldProps {
  name: string;
}

class HelloWorld extends React.Component<HelloWorldProps, { count: number }> {
  constructor(props: HelloWorldProps) {
    super(props);
    this.state = {
      count: 0,
    };
    this.myClick = this.myClick.bind(this);
  }
  public render() {
    return (
      <div className={styles.app}>
        <h1>Hello world {this.state.count}</h1>
        <button onClick={this.myClick}>COUNT UP</button>
      </div>
    );
  }
  private myClick() {
    this.setState({ count: this.state.count + 1 });
  }
}

export { HelloWorldProps as Props, HelloWorld as Component };
