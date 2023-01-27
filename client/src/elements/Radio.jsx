import React from 'react';

import { cloneDeep, debounce } from 'lodash';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { DEBOUNCE_INTERVAL, WS_STATUS } from '../Constants';

class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: props.value,
    };

    /*
     * HELPER METHODS
     */

    this.debouncer = debounce((e) => {
      const { callback } = this.props;

      callback(e, this.props, this.state, true);
    }, DEBOUNCE_INTERVAL, { trailing: true });

    /*
    * EVENT HANDLERS
    */
    this.onChange = (event) => {
      const { target } = event;
      const { callback } = this.props;

      const e = cloneDeep(event);

      this.setState({ selectedOption: target.value }, () => {
        callback(e, this.props, this.state);

        this.debouncer(e, this.props, this.state);
      });
    };
  }

  /*
  * LIFECYCLE METHODS
  */

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;

    if (value !== prevState.selectedOption) {
      this.setState({ selectedOption: value });
    }
  }

  render() {
    const { value: contextValue } = this.context;
    const { disabled, id, options } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className="row" key={id}>
        {options.map((option) => (
          <div className="col-md-6" key={option.id}>
            <div className={`form-check${option.value === selectedOption ? ' isActive' : ''}`}>
              <input className="form-check-input" checked={option.value === selectedOption} disabled={disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE} id={option.id} name={id} onChange={this.onChange} type="radio" value={option.value} />
              <label className="form-check-label" htmlFor={option.id}>
                <div className="form-check-toggle" />
                {option.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Radio.contextType = AppContext;

Radio.defaultProps = {
  callback: null,
  disabled: false,
  options: [],
  value: null,
};

Radio.propTypes = {
  callback: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      order: PropTypes.number,
      value: PropTypes.string,
    }),
  ),
  value: PropTypes.string,
};

export default Radio;
