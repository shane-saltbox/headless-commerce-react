import React from 'react';

import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { WS_STATUS } from '../Constants';

class CheckboxCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked,
    };

    /*
     * EVENT HANDLERS
     */

    this.handleClick = (event) => {
      const { callback, label } = this.props;
      const { checked } = this.state;

      // Send GTM custom event.
      window.dataLayer.push({
        data: { label, checked: !checked },
        event: 'My Interests Checkbox Click',
        'gtm.element': event.target,
        'gtm.elementClasses': event.target.className || '',
        'gtm.elementId': event.target.id || '',
        'gtm.elementTarget': event.target.target || '',
        'gtm.elementUrl': event.target.href || event.target.action || '',
        'gtm.originalEvent': event,
      });

      this.setState({ checked: !checked }, () => {
        callback(event, this.props, this.state);
      });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  render() {
    const { value: contextValue } = this.context;
    const {
      availableIntId,
      checked: propChecked,
      description,
      disabled,
      imageUrl,
      label,
    } = this.props;
    const { checked } = this.state;

    return (
      <div className={`form-check form-check-card${(disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE) ? ' isDisabled' : ''}${checked ? ' isActive' : ''}`}>
        <input className="form-check-input" disabled={disabled || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE} id={availableIntId} type="checkbox" defaultChecked={propChecked} name={availableIntId} onClick={this.handleClick} />
        <label className="form-check-label" htmlFor={availableIntId}>
          <div className="card mix_checkbox">
            <img src={imageUrl} className="card-img-top" alt="" />
            <div className="card-body">
              <div className="form-check-toggle" />
              {label}
              <p className="form-check-description">{description}</p>
            </div>
          </div>
        </label>
      </div>
    );
  }
}

CheckboxCard.contextType = AppContext;

CheckboxCard.defaultProps = {
  callback: null,
  checked: false,
  description: null,
  id: null,
  imageUrl: null,
};

CheckboxCard.propTypes = {
  availableIntId: PropTypes.string.isRequired,
  callback: PropTypes.func,
  checked: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string,
  imageUrl: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default CheckboxCard;
