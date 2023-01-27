import React from 'react';

import { cloneDeep, debounce } from 'lodash';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { DEBOUNCE_INTERVAL, WS_STATUS } from '../Constants';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
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
      const { value } = this.state;

      const e = cloneDeep(event);

      const valueArray = (value ? value.split(';') : []);

      if (target.checked) {
        valueArray.push(target.value);
      } else {
        valueArray.splice(valueArray.indexOf(target.value), 1);
      }

      this.setState({ value: valueArray.join(';') }, () => {
        if (callback) {
          callback(e, this.props, this.state);

          this.debouncer(e);
        }
      });
    };
  }

  /*
  * LIFECYCLE METHODS
  */

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;

    if (value !== prevState.value) {
      this.setState({ value });
    }
  }

  render() {
    const { value: contextValue } = this.context;
    const { disabled, id, options } = this.props;
    const { value } = this.state;

    return (
      <div className="row" key={id}>
        {options.map((option) => (
          <div className="col-md-6" key={option.id}>
            <div className={`form-check${option.ischecked ? ' isActive' : ''}`}>
              <input className="form-check-input" checked={option.ischecked} disabled={disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE}  id={option.id} onChange={this.onChange} type="checkbox" value={option.value} />
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

Checkbox.contextType = AppContext;

Checkbox.defaultProps = {
  callback: null,
  disabled: false,
  options: [],
  value: null,
};

Checkbox.propTypes = {
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

export default Checkbox;