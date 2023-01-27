/* eslint-disable react/no-danger */

import React from 'react';

import PropTypes from 'prop-types';

import MyProfileService from '../services/myprofile-service';

import AppContext from '../AppContext';

class ForgetMe extends React.Component {
  constructor(props) {
    super(props);

    this.wsEndpoint = null;

    /*
     * EVENT HANDLERS
     */

    this.onClick = (event) => {
      event.preventDefault();

      // Send GTM custom event.
      window.dataLayer.push({
        // data: label,
        event: 'Forget Me Button Click',
        'gtm.element': event.target,
        'gtm.elementClasses': event.target.className || '',
        'gtm.elementId': event.target.id || '',
        'gtm.elementTarget': event.target.target || '',
        'gtm.elementUrl': event.target.href || event.target.action || '',
        'gtm.originalEvent': event,
      });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    const { value } = this.context;

    this.wsEndpoint = new MyProfileService(value.bu, value.lang, value.wsBaseUrl);
  }

  /*
   * RENDERING METHODS
   */

  renderBody() {
    const { value } = this.context;

    return (
      { __html: value.strings.forgetMe_modal_body }
    );
  }

  render() {
    const { value } = this.context;
    const { className } = this.props;

    return (
      <div className={className}>
        <button className="btn btn-large btn-link" data-toggle="modal" data-target="#forgetMeConfirmation" onClick={this.onClick} type="button">{value.strings.forgetMe_button_primary}</button>
        <div className="modal" id="forgetMeConfirmation" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{value.strings.forgetMe_modal_title}</h5>
                <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <span dangerouslySetInnerHTML={this.renderBody()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ForgetMe.contextType = AppContext;

ForgetMe.defaultProps = {
  className: 'float-right mr-2',
};

ForgetMe.propTypes = {
  className: PropTypes.string,
};

export default ForgetMe;
