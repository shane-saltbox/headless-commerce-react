import React from 'react';

import PropTypes from 'prop-types';

class Badge extends React.Component {
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
        data: label,
        event: 'My Subscriptions Campaign Checkbox Click',
        // 'gtm.element': event.target,
        // 'gtm.elementClasses': event.target.className || '',
        // 'gtm.elementId': event.target.id || '',
        // 'gtm.elementTarget': event.target.target || '',
        // 'gtm.elementUrl': event.target.href || event.target.action || '',
        // 'gtm.originalEvent': event,
      });

      this.setState({ checked: !checked }, () => {
        callback(event, this.props, this.state);
      });
    };
  }

  render() {
    const { label } = this.props;
    const { checked } = this.state;

    return (
      <span className={`badge badge-campaign badge-pill${checked ? '' : ' d-none'}`}>
        {label}
        <span className="badge-icon" onClick={this.handleClick}>
          <svg className="bi bi-x-circle-fill" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.354 6.646L10 9.293l2.646-2.647a.5.5 0 01.708.708L10.707 10l2.647 2.646a.5.5 0 01-.708.708L10 10.707l-2.646 2.647a.5.5 0 01-.708-.708L9.293 10 6.646 7.354a.5.5 0 11.708-.708z" clipRule="evenodd" />
          </svg>
        </span>
      </span>
    );
  }
}

Badge.propTypes = {
  callback: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default Badge;
