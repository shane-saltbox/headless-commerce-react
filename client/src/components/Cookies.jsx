import React from 'react';

import $ from 'jquery';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';

import AppContext from '../AppContext';

class Cookies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gdprCookie: null,
    };

    this.ref = React.createRef();

    /*
    * EVENT HANDLERS
    */

    this.handleClick = () => {
      const $this = $(this.ref.current);

      const { cookies } = this.props;
      const height = $(this.ref.current).outerHeight();

      $this.animate({
        bottom: -(height),
      }, 'fast', () => {
        cookies.set('gdpr-cookies', Date(), { path: '/' });
      });
    };
  }

  componentDidMount() {
    const { cookies } = this.props;

    this.setState({ gdprCookie: cookies.get('gdpr-cookies') });
  }

  renderText() {
    const { value } = this.context;

    return (
      { __html: value.strings.cookies_text }
    );
  }

  render() {
    const { value } = this.context;
    const { gdprCookie } = this.state;

    let markup = null;

    if (!gdprCookie) {
      markup = (
        <div className="gdpr-cookies" ref={this.ref}>
          <div className="row align-items-md-center">
            {value.strings.cookies_text ? <div className="col-lg-6 mb-4 mb-lg-0 offset-lg-1 text-center" dangerouslySetInnerHTML={this.renderText()} /> : <div className="col-lg-6 mb-4 mb-lg-0 offset-lg-1 text-center"><Skeleton count={3} /></div>}
            <div className="col-lg-3 offset-lg-1 text-center">
              <button className="btn btn-primary" onClick={this.handleClick} type="button">{value.strings.cookies_button || <Skeleton />}</button>
            </div>
          </div>
        </div>
      );
    }

    return markup;
  }
}

Cookies.contextType = AppContext;

Cookies.defaultProps = {
  cookies: {},
};

Cookies.propTypes = {
  cookies: PropTypes.shape({
    get: PropTypes.func,
    HAS_DOCUMENT_COOKIE: PropTypes.bool.isRequired,
    set: PropTypes.func,
  }),
};

export default withCookies(Cookies);
