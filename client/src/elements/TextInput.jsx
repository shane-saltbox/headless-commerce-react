import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { ISVALID, WS_STATUS } from '../Constants';

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    const { defaultValue } = this.props;

    this.state = {
      isValid: ISVALID.UNKNOWN,
      value: (defaultValue === ' ') ? null : defaultValue,
    };

    /*
     * EVENT HANDLERS
     */

    this.onBlur = (event) => {
      const { callback, label } = this.props;
      const { isValid, value } = this.state;

      const $this = $(event.target);
      const newValue = $this.val();

      if (isValid === ISVALID.NO) return;

      this.setState({ isValid: ISVALID.UNKNOWN });

      if (value === newValue) return;

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

      this.setState({ value: newValue }, () => {
        callback(event, this.props, this.state);
      });
    };

    this.onChange = (event) => {
      const { required } = this.props;
      const { value } = event.target;

      if (required && value.length) {
        this.setState({ isValid: ISVALID.YES });
      } else if (required && !value.length) {
        this.setState({ isValid: ISVALID.NO });
      } else {
        this.setState({ isValid: ISVALID.UNKNOWN });
      }
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  render() {
    const { value: contextValue } = this.context;
    const {
      defaultValue,
      disabled,
      helpText,
      id,
      label,
      placeholder,
    } = this.props;

    const { isValid } = this.state;

    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input className={`form-control ${isValid}`} aria-describedby={id} defaultValue={defaultValue} disabled={(disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE)} id={id} name={id} onBlur={this.onBlur} onChange={this.onChange} placeholder={placeholder} type="text" />
        {helpText ? <small className="form-text text-muted" id={`${id}_help`}>{helpText}</small> : ''}
      </div>
    );
  }
}

TextInput.contextType = AppContext;

TextInput.defaultProps = {
  defaultValue: null,
  helpText: null,
  placeholder: null,
  required: false,
};

TextInput.propTypes = {
  callback: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default TextInput;
