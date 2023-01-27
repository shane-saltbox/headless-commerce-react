import React from 'react';

import PropTypes from 'prop-types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { v4 as uuidv4 } from 'uuid';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      today: new Date(),
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  render() {
    const { allRightsReserved, companyName, links } = this.props;
    const { today } = this.state;

    const mappedLinks = links.map((link) => (
      <li className="list-inline-item" key={uuidv4()}><a href={link.url} rel="noopener noreferrer" target="_blank">{link.label}</a></li>
    ));

    return (
      <footer>
        <div className="container">
          {companyName && allRightsReserved ? (
            <>
              <ul className="footer-nav list-inline">
                {mappedLinks}
              </ul>
              <p className="footer-legal">{companyName}®</p>
              <p className="footer-legal">© {today.getFullYear()} {companyName}. {allRightsReserved}</p>
            </>
          ) : <SkeletonTheme color="#242424" highlightColor="#282828"><Skeleton count={3} /></SkeletonTheme>}
        </div>
      </footer>
    );
  }
}

Footer.defaultProps = {
  companyName: null,
  allRightsReserved: null,
};

Footer.propTypes = {
  allRightsReserved: PropTypes.string,
  companyName: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    }),
  ).isRequired,
};

export default Footer;
