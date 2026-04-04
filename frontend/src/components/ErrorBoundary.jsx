import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    try {
      localStorage.setItem('zorvyn_last_error', JSON.stringify({ message: error?.message, stack: error?.stack, info }));
    } catch (e) {}
    console.error("Captured error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{padding:20,fontFamily:'sans-serif'}}>
          <h2 style={{color:'#c00'}}>An error occurred</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{this.state.error.message}</pre>
          <details style={{whiteSpace:'pre-wrap'}}>
            {this.state.error.stack}
            {this.state.info && JSON.stringify(this.state.info)}
          </details>
          <div style={{marginTop:12}}>
            <small>Saved error to localStorage key `zorvyn_last_error`.</small>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
