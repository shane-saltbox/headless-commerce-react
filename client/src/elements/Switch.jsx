import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';

import AppContext from '../AppContext';
import { Badge } from '../components';
import { WS_STATUS } from '../Constants';

import 'bootstrap/dist/js/bootstrap.bundle';

class Switch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: (props.checked !== null ? props.checked : false),
    };

    /*
     * EVENT HANDLERS
     */

    this.handleClick = (event) => {
      const {
        availableSubId,
        callback,
        disabled,
        label,
      } = this.props;
      const { checked } = this.state;

      if (disabled) { return; }

      // Send GTM custom event.
      window.dataLayer.push({
        data: { label, checked: !checked },
        event: 'My Subscriptions Checkbox Click',
        'gtm.element': event.target,
        'gtm.elementClasses': event.target.className || '',
        'gtm.elementId': event.target.id || '',
        'gtm.elementTarget': event.target.target || '',
        'gtm.elementUrl': event.target.href || event.target.action || '',
        'gtm.originalEvent': event,
      });

      this.setState({ checked: !checked }, () => {
        if (!checked) {
          $(`#collapse_${availableSubId}`).collapse('show');
        } else {
          $(`#collapse_${availableSubId}`).collapse('hide');
        }

        callback(event, this.props, this.state);
      });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidUpdate(prevProps) {
    const { checked } = this.props;

    if (checked !== prevProps.checked) {
      this.setState({ checked });
    }
  }

  renderChannelLabel() {
    const { value } = this.context;
    const { channel } = this.props;

    let channelLabel = null;

    if (value.settings.channelLabelsEnabled) {
      channelLabel = <span className={`form-switch-badge badge badge-pill badge-light${channel === 'sms' ? ' text-uppercase' : ''}`}>{(channel === 'SMS') ? value.strings.badge_sms : value.strings.badge_email}</span>;
    }

    return channelLabel;
  }

  render() {
    const { value: contextValue } = this.context;
    const {
      availableSubId,
      callbackBadge,
      campaigns,
      checked: propChecked,
      description,
      disabled,
      label,
      userSubId,
    } = this.props;
    const { checked } = this.state;

    const renderedCampaigns = campaigns.filter((campaign) => campaign.memberStatus === true).map((campaign) => (
      <Badge callback={callbackBadge} checked={campaign.memberStatus} disabled={false} id={campaign.id} key={campaign.id} label={campaign.name} memberId={campaign.memberId} />
    ));

    return (
      <div>
        <div className={`form-switch${((disabled && userSubId === null) || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE) ? ' isDisabled' : ''}${checked ? ' isActive' : ''}`}>
          <input className="form-switch-input" defaultChecked={propChecked} disabled={((disabled && userSubId === null) || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE)} id={availableSubId} name={availableSubId} onClick={this.handleClick} type="checkbox" />
          <label className="form-switch-label" htmlFor={availableSubId}>
            <div className="form-switch-text">
              {label} {this.renderChannelLabel()}
              <p className="form-switch-description">{description}</p>
            </div>
            <div className="form-switch-toggle" />
          </label>
        </div>
        <div className={`collapse form-switch-campaigns${((disabled && userSubId === null) || contextValue.wsStatus === WS_STATUS.STATE.ACTIVE) ? ' d-none' : ''}${campaigns.length && propChecked ? ' show' : ''}`} id={`collapse_${availableSubId}`}>
          {renderedCampaigns}
        </div>
      </div>
    );
  }
}

Switch.contextType = AppContext;

Switch.defaultProps = {
  checked: false,
  description: '',
  id: null,
  userSubId: '',
};

Switch.propTypes = {
  availableSubId: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  callbackBadge: PropTypes.func.isRequired,
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      filter: PropTypes.func,
      length: PropTypes.func,
      memberId: PropTypes.string,
      memberStatus: PropTypes.bool,
      name: PropTypes.string,
    }),
  ).isRequired,
  channel: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  userSubId: PropTypes.string,
};

export default Switch;
