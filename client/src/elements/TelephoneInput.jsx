import React from 'react';

import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { ISVALID, WS_STATUS } from '../Constants';

class TelephoneInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isValid: ISVALID.UNKNOWN,
      originalValue: (props.defaultValue === null ? '' : props.defaultValue),
      value: (props.defaultValue === null ? '' : props.defaultValue),
    };

    /*
     * HELPER METHODS
     */
    this.formatString = (rawString) => {
      if (rawString.length < 10) return rawString;

      const formattedString = rawString.replace(/\D/g, '').split('');

      formattedString.splice(-4, 0, '-');
      formattedString.splice(-8, 0, ') ');
      formattedString.splice(-12, 0, '(');

      if (formattedString.length > 13) {
        formattedString.splice(-13, 0, ' ');
        formattedString.splice(0, 0, '+');
      }

      return formattedString.join('');
    };

    /*
     * EVENT HANDLERS
     */

    this.onBlur = (event) => {
      const { callback, label } = this.props;
      const { isValid, originalValue } = this.state;

      const e = cloneDeep(event);

      const newValue = event.target.value;

      if (isValid === ISVALID.NO) return;

      this.setState({ isValid: ISVALID.UNKNOWN, value: this.formatString(newValue) }, () => {
        if (newValue === originalValue) return;

        this.setState({ originalValue: newValue });

        // Send GTM custom event.
        window.dataLayer.push({
          data: label,
          event: 'My Profile Field Value Change',
          'gtm.element': e.target,
          'gtm.elementClasses': e.target.className || '',
          'gtm.elementId': e.target.id || '',
          'gtm.elementTarget': e.target.target || '',
          'gtm.elementUrl': e.target.href || e.target.action || '',
          'gtm.originalEvent': e,
        });

        callback(e, this.props, { value: newValue });
      });
    };

    this.onFocus = () => {
      const { value } = this.state;

      const newValue = value.replace(/\D/g, '');

      this.setState({ value: newValue });
    };

    this.onChange = (event) => {
      const { required } = this.props;
      const { value } = event.target;

      const newValue = value.replace(/\D/g, '');

      if ((!required && newValue.length === 0) || (newValue.length >= 10 && newValue.length <= 13)) {
        this.setState({ isValid: ISVALID.YES, value: newValue });
      } else {
        this.setState({ isValid: ISVALID.NO, value: newValue });
      }
    };
  }

  /*
   * LIFECYCLE METHODS
   */
  componentDidMount() {
    const { value } = this.state;

    if (value.length) {
      this.setState({ value: this.formatString(value) });
    }
  }

  render() {
    const { value: contextValue } = this.context;
    const {
      disabled,
      helpText,
      id,
      label,
      placeholder,
    } = this.props;
    const { isValid, mask, value } = this.state;

    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input className={`form-control ${isValid}`} aria-describedby={id} disabled={(disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE)} id={id} mask={mask} maxLength="13" name={id} onBlur={this.onBlur} onFocus={this.onFocus} onChange={this.onChange} placeholder={placeholder} type="tel" value={value} />
        {helpText ? <small className="form-text text-muted" id={`${id}_help`}>{helpText}</small> : ''}
      </div>
    );
  }
}

TelephoneInput.contextType = AppContext;

TelephoneInput.defaultProps = {
  callback: null,
  defaultValue: undefined,
  helpText: null,
  placeholder: null,
  required: false,
};

TelephoneInput.propTypes = {
  callback: PropTypes.func,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default TelephoneInput;
