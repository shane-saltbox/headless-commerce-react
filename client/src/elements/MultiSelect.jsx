import React from 'react';

import { debounce, isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import Select from 'react-select'; // SEE: https://github.com/JedWatson/react-select

import AppContext from '../AppContext';
import { DEBOUNCE_INTERVAL, ISVALID, WS_STATUS } from '../Constants';

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMulti: (props.controlType.toLowerCase() === 'multi-picklist'),
      isValid: ISVALID.UNKNOWN,
      options: props.options,
      value: props.value,
    };

    /*
     * EVENT HANDLERS
     */

    this.onChange = (selections) => {
      const { callback, label, required } = this.props;

      if (required && (selections === null || selections.length === 0)) {
        this.setState({ isValid: ISVALID.NO });
      } else {
        // Send GTM custom event.
        window.dataLayer.push({
          data: label,
          event: 'My Profile Field Value Change',
        //   'gtm.element': event.target,
        //   'gtm.elementClasses': event.target.className || '',
        //   'gtm.elementId': event.target.id || '',
        //   'gtm.elementTarget': event.target.target || '',
        //   'gtm.elementUrl': event.target.href || event.target.action || '',
        //   'gtm.originalEvent': event,
        });

        this.setState({ isValid: ISVALID.UNKNOWN, value: selections }, () => {
          if (callback) {
            callback(selections, this.props, this.state);

            this.debouncer(selections, this.props, this.state);
          }
        });
      }
    };

    /*
     * HELPER METHODS
     */

    this.debouncer = debounce((selections) => {
      const { callback } = this.props;

      callback(selections, this.props, this.state, true);
    }, DEBOUNCE_INTERVAL, { trailing: true });

    this.sortOptions = () => {
      const { options, value } = this.props;

      const labels = (value !== null) ? value.split(';') : [];

      const filteredOptions = options.filter((option) => option.label !== null && option.value !== null);

      const sortedOptions = sortBy(filteredOptions, 'order');

      const filteredValue = sortedOptions.filter((option) => labels.includes(option.value));

      const sortedValue = sortBy(filteredValue, 'order');

      sortedOptions.forEach((object) => {
        const modifiedObject = object;

        modifiedObject.key = object.id;
      });

      sortedValue.forEach((object) => {
        const modifiedObject = object;

        modifiedObject.key = object.id;
      });

      this.setState({ options: sortedOptions, value: sortedValue });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    this.sortOptions();
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;

    if (isEqual(options, prevProps.options) === false) {
      this.sortOptions();
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
    const {
      isMulti,
      isValid,
      options,
      value,
    } = this.state;

    return (
      <div className={`form-group ${isValid} ${(disabled ? 'isDisabled' : '')}`}>
        <label htmlFor={id}>{label}</label>
        <Select className="form-multiselect" closeMenuOnSelect={!isMulti} isClearable isMulti={isMulti} isDisabled={disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE} isSearchable={false} name={id} noOptionsMessag="No options" onChange={this.onChange} options={options} placeholder={placeholder} value={value} />
        {helpText ? <small className="form-text text-muted" id={`${id}_help`}>{helpText}</small> : ''}
      </div>
    );
  }
}

MultiSelect.contextType = AppContext;

MultiSelect.defaultProps = {
  label: null,
  helpText: null,
  placeholder: '',
  required: false,
  value: null,
};

MultiSelect.propTypes = {
  callback: PropTypes.func.isRequired,
  controlType: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      order: PropTypes.number,
      value: PropTypes.string,
    }),
  ).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        order: PropTypes.number,
        value: PropTypes.string,
      }),
    ),
  ]),
};

export default MultiSelect;
