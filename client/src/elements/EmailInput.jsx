import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { ISVALID, WS_STATUS } from '../Constants';

class EmailInput extends React.Component {
  constructor(props) {
    super(props);

    this.regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    this.state = {
      isValid: ISVALID.UNKNOWN,
      originalValue: (props.defaultValue === ' ') ? null : props.defaultValue,
      value: (props.defaultValue === ' ') ? null : props.defaultValue,
    };

    /*
     * EVENT HANDLERS
     */

    this.onBlur = (event) => {
      const { callback, label } = this.props;
      const { isValid, originalValue } = this.state;

      const $this = $(event.target);
      const newValue = $this.val();

      if (isValid === ISVALID.NO) return;

      this.setState({ validity: ISVALID.UNKNOWN });

      if (newValue === originalValue) return;

      // Send GTM custom event.
      window.dataLayer.push({
        data: label,
        event: 'My Profile Field Value Change',
        'gtm.element': event.target,
        'gtm.elementClasses': event.target.className || '',
        'gtm.elementId': event.target.id || '',
        'gtm.elementTarget': event.target.target || '',
        'gtm.elementUrl': event.target.href || event.target.action || '',
        'gtm.originalEvent': event,
      });

      this.setState({ originalValue: newValue, value: newValue }, () => {
        callback(event, this.props, this.state);
      });
    };

    this.onChange = (event) => {
      const { required } = this.props;
      const { value } = event.target;

      const isValid = this.regex.test(String(value).toLocaleLowerCase());

      if (isValid) {
        this.setState({ isValid: ISVALID.YES });
      } else if (!required && value.length === 0) {
        this.setState({ isValid: ISVALID.UNKNOWN });
      } else {
        this.setState({ isValid: ISVALID.NO });
      }
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  render() {
    const { value: contextValue } = this.context;
    const {
      disabled,
      helpText,
      id,
      label,
      placeholder,
    } = this.props;
    const { isValid, value } = this.state;

    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input className={`form-control ${isValid}`} aria-describedby={id} defaultValue={value} disabled={disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE} id={id} name={id} onBlur={this.onBlur} onChange={this.onChange} placeholder={placeholder} type="email" />
        {helpText ? <small className="form-text text-muted" id={`${id}_help`}>{helpText}</small> : ''}
      </div>
    );
  }
}

EmailInput.contextType = AppContext;

EmailInput.defaultProps = {
  callback: null,
  defaultValue: null,
  helpText: null,
  placeholder: null,
  required: false,
};

EmailInput.propTypes = {
  callback: PropTypes.func,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default EmailInput;
