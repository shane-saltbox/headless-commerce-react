import React from 'react';

import PropTypes from 'prop-types';

const Modal = (props) => {
  const {
    body,
    id,
    primaryButton,
    primaryButtonCallback,
    secondaryButton,
    secondaryButtonCallback,
    title,
  } = props;

  /*
   * EVENT HANDLERS
   */

  const onClickPrimaryButton = (event) => (primaryButtonCallback ? primaryButtonCallback(event) : null);

  const onClickSecondaryButton = (event) => (secondaryButtonCallback ? secondaryButtonCallback(event) : null);

  return (
    <div className="modal" id={id} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{body}</p>
          </div>
          <div className="modal-footer">
            {(secondaryButton ? <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onClickSecondaryButton}>{secondaryButton}</button> : null)}
            {(primaryButton ? <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={onClickPrimaryButton}>{primaryButton}</button> : null)}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  body: null,
  primaryButton: null,
  primaryButtonCallback: null,
  secondaryButton: null,
  secondaryButtonCallback: null,
  title: null,
};

Modal.propTypes = {
  body: PropTypes.string,
  id: PropTypes.string.isRequired,
  primaryButton: PropTypes.string,
  primaryButtonCallback: PropTypes.func,
  secondaryButton: PropTypes.string,
  secondaryButtonCallback: PropTypes.func,
  title: PropTypes.string,
};

export default Modal;
