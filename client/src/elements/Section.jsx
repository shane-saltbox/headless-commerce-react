import React from 'react';

import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import {
  MySubscriptions
} from '../components';

class Section extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }
  /*
   * LIFECYCLE METHODS
   */

  renderDescription() {
    const { description } = this.props;

    return (
      { __html: description }
    );
  }

  render() {
    const {
      headline,
      id,
      sidebarRef,
    } = this.props;

    let formBody;

    switch (id) {
      case 'my-subscriptions':
        formBody = <MySubscriptions id={id} sectionRef={this.ref} sidebarRef={sidebarRef} />;
        break;
      default:
        formBody = <div />;
        break;
    }

    return (
      <section ref={this.ref}>
        <a className="sr-only" href={`#${id}`} name={id}>{headline}</a>
        <h2>{headline || <Skeleton />}</h2>
        {headline ? <div className="section-description" dangerouslySetInnerHTML={this.renderDescription()} /> : <Skeleton count={3} />}
        {formBody}
      </section>
    );
  }
}

Section.defaultProps = {
  description: null,
  headline: null,
};

Section.propTypes = {
  description: PropTypes.string,
  headline: PropTypes.string,
  id: PropTypes.string.isRequired,
  sidebarRef: PropTypes.shape().isRequired,
};

export default Section;
