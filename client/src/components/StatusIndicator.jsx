import React from 'react';

import Skeleton from 'react-loading-skeleton';

import AppContext from '../AppContext';
import { WS_STATUS } from '../Constants';

class StatusIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      status: WS_STATUS.STATE.IDLE,
    };

    this.timer = null;

    /*
     * EVENT HANDLERS
     */

    this.onTimeout = () => {
      const { value, setValue } = this.context;

      this.setState({ disabled: false, status: WS_STATUS.STATE.IDLE }, () => {
        setValue(
          { ...value.globalAlert },
          { ...value.locale },
          value.roadblocked,
          { ...value.settings },
          { ...value.strings },
          { ...value.theme },
          WS_STATUS.STATE.IDLE,
        );
      });
    };

    /*
     * HELPER METHODS
     */

    this.setTimer = () => {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => this.onTimeout(), WS_STATUS.DURATION);
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.context;
    const { status } = this.state;

    if (value.wsStatus === prevState.status) { return; }

    if (value.wsStatus === WS_STATUS.STATE.ACTIVE && value.wsStatus !== status) {
      this.setState({
        disabled: true,
        status: WS_STATUS.STATE.ACTIVE,
      });
    } else if (value.wsStatus === WS_STATUS.STATE.COMPLETE && value.wsStatus !== status) {
      this.setState({
        status: WS_STATUS.STATE.COMPLETE,
      }, this.setTimer);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { value } = this.context;
    const { disabled } = this.state;

    return (
      <button className="btn btn-lg btn-primary" disabled={disabled} id="btn-save" onClick={() => {}} type="button">
        {value.strings.button_submit || <Skeleton />}
      </button>
    );
  }
}

StatusIndicator.contextType = AppContext;

export default StatusIndicator;
