import React from 'react';

import AppContext from '../AppContext';

class GlobalAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dismissed: false,
    };

    /*
    * EVENT HANDLERS
    */

    this.onClickCloseButton = () => {
      this.setState({ dismissed: true });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    const { value } = this.context;

    this.setState({ dismissed: value.globalAlert.dismissed });
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.context;

    if (prevState.dismissed !== value.globalAlert.dismissed) {
      this.setState({ dismissed: value.globalAlert.dismissed });
    }
  }

  renderAlert() {
    const { value } = this.context;
    const { dismissed } = this.state;

    let markup = null;

    if (!dismissed) {
      markup = (
        <div className={`alert alert-global alert-${value.globalAlert.type} mb-5`} role="alert">
          <span dangerouslySetInnerHTML={this.renderMessage()} />
          <button type="button" className="close" aria-label="Close" onClick={this.onClickCloseButton}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return markup;
  }

  renderMessage() {
    const { value } = this.context;

    return (
      { __html: value.globalAlert.message }
    );
  }

  render() {
    return (
      <>
        {this.renderAlert()}
      </>
    );
  }
}

GlobalAlert.contextType = AppContext;

export default GlobalAlert;
