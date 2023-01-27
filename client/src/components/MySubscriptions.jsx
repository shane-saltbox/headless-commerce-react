/* eslint-disable no-param-reassign */

import React from 'react';

import $ from 'jquery';
import { cloneDeep, isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import AppContext from '../AppContext';
import MySubscriptionsService from '../services/mysubscriptions-service';

class MySubscriptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldGroups: [],
      locale: {
        businessUnit: null,
        language: null,
      },
      wsException: false,
    };

    this.pathname = window.location.pathname.replace(/\//gi, '');
    this.urlParams = new URLSearchParams(window.location.search);
    this.id = this.urlParams.get('id');
    this.jobid = this.urlParams.get('jobid');
    this.listid = this.urlParams.get('listid');
    this.batchid = this.urlParams.get('batchid');

    this.wsEndpoint = new MySubscriptionsService(null, this.id, null, '/api', this.jobid, this.listid, this.batchid);

    /*
     * EVENT HANDLERS
     */

    this.onClickBadge = (event, badgeProps, badgeState) => {
      const $save = $('#btn-save');

      $save.attr('disabled', true);

      this.wsEndpoint.deleteCampaign(badgeProps.memberId, badgeState.checked, badgeProps.id)
        .then((response) => {
          if (response.success) {
            $save.attr('disabled', false);
          } else {
            
          }
        });
    };

    this.onClickSwitch = (event, switchProps, switchState) => {
      this.wsEndpoint.patchSubscription(switchProps.availableSubId, switchState.checked, switchProps.id, this.jobid, this.listid, this.batchid).then((response) => {
        const { fieldGroups } = this.state;

        if (response.success) {
          const newFieldGroups = cloneDeep(fieldGroups);

          newFieldGroups.forEach((fieldGroup) => {
            fieldGroup.subscriptions.forEach((subscription) => {
              const modifiedSubscription = subscription;

              if (modifiedSubscription.availableSubId === switchProps.availableSubId) {
                modifiedSubscription.checked = switchState.checked;
                modifiedSubscription.userSubId = response.data.length ? response.data[0].sfid : null;
              }
            });
          });

          this.setState({ fieldGroups: newFieldGroups });
        } else {
          
        }
      });
    };

    /*
    * HELPER METHODS
    */

    this.callback_unsubscribeAll = () => {
      const { value, setValue } = this.context;

      this.wsEndpoint.unsubscribeAll(value.settings.unsubscribeAllEnabled).then((response) => {
        const { fieldGroups } = this.state;

        if (response.success) {
          let newFieldGroups = cloneDeep(fieldGroups);

          newFieldGroups = newFieldGroups.map((fieldGroup) => {
            fieldGroup.subscriptions = fieldGroup.subscriptions.map((subscription) => ({ ...subscription, checked: false }));

            return fieldGroup;
          });

          this.setState({ fieldGroups: newFieldGroups }, () => {
            // Show a global alert.
            setValue(
              {
                dismissed: false,
                message: value.strings.unsubscribeAllAlert_successMessage,
                type: 'success',
              },
              { ...value.locale },
              value.roadblocked,
              { ...value.settings },
              { ...value.strings },
              { ...value.theme },
              value.wsStatus,
            );
          });
        }
      });
    };

    this.collapsibleIsActive = (subscriptions) => {
      const isInactive = (subscription) => subscription.checked !== true;

      // Additional categorys are closed if they do not contain subscriptions.
      if (subscriptions.length === 0) return false;

      // Additional categories are closed if they contain subscriptions but all are not checked.
      if (subscriptions.every(isInactive)) return false;

      return true;
    };

    this.fetchData = () => {
      this.wsEndpoint.get()
        .then((response) => {
          const { data, success } = response;

          if (!success) throw new Error();

          const sortedfieldGroups = sortBy(data, 'catorder');

          sortedfieldGroups.forEach((fieldGroup) => {
            const modifiedFieldGroup = fieldGroup;
            const filteredSubscriptions = modifiedFieldGroup.subscriptions.filter((subscription) => subscription.public === true || subscription.userSubId !== null);
            const sortedSubscriptions = sortBy(filteredSubscriptions, 'order');

            sortedSubscriptions.forEach((subscription) => {
              const modifiedSubscription = subscription;
              const sortedCampaigns = sortBy(modifiedSubscription.campaigns, 'order');

              modifiedSubscription.campaigns = sortedCampaigns;
            });

            modifiedFieldGroup.subscriptions = sortedSubscriptions;
          });

          this.setState({ fieldGroups: sortedfieldGroups });
        })
        .catch(() => {
          this.setState({ wsException: true, fieldGroups: [] });
        });
    };
  }

  /*
   * LIFECYCLE METHODS
   */

  componentDidMount() {
    const { value } = this.context;

    this.setState({ locale: { ...value.locale } });
  }

  componentDidUpdate(prevProps, prevState) {
    const { setValue, value } = this.context;
    const { fieldGroups, locale } = this.state;

    if (this.context && value && !isEqual(value.locale, locale)) {
      this.setState({ locale: { ...value.locale } });
    }

    if (!isEqual(prevState.locale, locale)) {
      this.wsEndpoint.id = value.id;
      this.wsEndpoint.bu = value.locale.businessUnit;
      this.wsEndpoint.lang = value.locale.language;

      this.fetchData();
    }

    if (!isEqual(prevState.fieldGroups, fieldGroups)) {
      // If "availableSubId" exists in the URL query string then the user should be automatically opted-in to the matching subscription.
      if (value.availableSubId) {
        const clonedFieldGroups = cloneDeep(fieldGroups);

        // Test to see if the specified ID exists somewhere in the collection.
        const subscription = (clonedFieldGroups.flatMap((fieldGroup) => fieldGroup.subscriptions.filter((s) => s.availableSubId === value.availableSubId && s.checked !== true))[0] || null);

        if (subscription) {
          // If the indicated ID exists then call the web service to subscribe the user and update the UI.
          this.wsEndpoint.patchSubscription(subscription.availableSubId, true)
            .then((response) => {
              if (response.success === 'fail') {
                
              } else {
                subscription.checked = true;

                this.setState({ fieldGroups: clonedFieldGroups });
              }
            });

          // Show a global alert
          setValue(
            {
              dismissed: false,
              message: `${value.strings.globalAlert_autoSubscribe} &ldquo;${subscription.label}&rdquo;`,
              type: 'success',
            },
            { ...value.locale },
            value.roadblocked,
            { ...value.settings },
            { ...value.strings },
            { ...value.theme },
            value.wsStatus,
          );
        }
      }
    }
  }

  render() {
    const { value } = this.context;
    const { id } = this.props;
    const { fieldGroups, wsException } = this.state;

    const mappedFieldGroups = fieldGroups.map((fieldGroup, index) => {
      const openOnLaunch = (index === 0 ? true : this.collapsibleIsActive(fieldGroup.subscriptions));

      let category = null;

      if (fieldGroup.subscriptions.length) {
        const collapsibleTiles = fieldGroup.subscriptions.map((subscription) => (
          <div className="collapsible-tile" key={subscription.availableSubId}>
          </div>
        ));

        //category = <Collapsible id={fieldGroup.catid} key={fieldGroup.catid} label={fieldGroup.catlabel} openOnLaunch={openOnLaunch} tiles={collapsibleTiles} />;
      }

      return category;
    });

    return (
      <>
        <div className={`alert alert-danger${wsException ? '' : ' d-none'}`} role="alert">
          <svg className="bi bi-alert-circle-fill" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.998 3a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clipRule="evenodd" />
          </svg>
          {value.strings.wsGetError}
        </div>
        {mappedFieldGroups}
        <div className="row">
          <div className="col-12">
            <Route exact path={`/${id}`}>
              <button className="btn btn-lg btn-primary" id="btn-save" onClick={this.onClickSaveButton} type="button">
                {value.strings.button_submit}
              </button>
            </Route>
            <button className="btn btn-large btn-secondary float-right" data-toggle="modal" data-target="#unsubscribeAll" type="button">{value.strings.button_unsubscribeAll}</button>
            
          </div>
        </div>
        
      </>
    );
  }
}

MySubscriptions.contextType = AppContext;

MySubscriptions.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MySubscriptions;
