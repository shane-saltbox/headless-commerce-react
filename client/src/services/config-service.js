import LoggingService from './logging-service';

class ConfigService {
  constructor(bu, lang, wsBaseUrl) {
    this.bu = bu;
    this.lang = lang;
    this.logger = new LoggingService(wsBaseUrl);
    this.wsBaseUrl = wsBaseUrl;

    /*
    * HELPER METHODS
    */

    this.parseResponseObject = (data) => {
      const { config, languages } = data;

      const parsedLanguages = languages.map((language) => {
        const parsedLanguage = {
          bu: language.business_unit_parameter__c,
          label: language.name,
          lang: language.language_parameter__c,
        };
        return parsedLanguage;
      });

      const parsedData = {
        managedContent: {
          images: {
            hero: {
              link: null,
              url: config.banner_url__c,
            },
            logo: {
              link: config.logo_link_url__c,
              url: config.logo_url__c,
            },
          },
          languages: parsedLanguages,
          links: {
            footer: [],
          },
          sections: [
            {
              description: config.profile_text__c,
              headline: config.profile_header__c,
              id: 'my-profile',
              order: 0,
            }, {
              description: config.interest_text__c,
              headline: config.interest_header__c,
              id: 'my-interests',
              order: 1,
            }, {
              description: config.q_and_a_text__c,
              headline: config.q_and_a_header__c,
              id: 'q-and-a',
              order: 2,
            }, {
              description: config.subscription_intro__c,
              headline: config.subscription_header__c,
              id: 'my-subscriptions',
              order: 3,
            },
          ],
        },
        settings: {
          channelLabelsEnabled: config.channel_labels_enabled__c,
          favIcon: config.fav_icon_url__c,
          forgetMeEnabled: config.forget_me_enabled__c,
          hero_headlineAlignment: config.banner_text_alignment__c,
          hero_heightIsFixed: config.banner_height_fixed__c,
          hero_isEnabled: config.banner_enabled__c,
          unsubscribeAllEnabled: config.unsubscribeall_isenabled__c,
        },
        strings: {
          badge_email: config.email_channel_text__c,
          badge_sms: config.sms_channel_text__c,
          button_submit: config.save_button_text__c,
          button_unsubscribeAll: config.unsubscribe_all_button_text__c,
          cookies_button: config.cookies_button_text__c,
          cookies_text: config.cookies_text__c,
          footer_allRightsReserved: config.footer_all_rights_text__c,
          footer_companyName: config.company_name__c,
          forgetMe_button_primary: config.forget_me_button_text__c,
          forgetMe_modal_body: config.forget_me_modal_body_text2__c,
          forgetMe_modal_title: config.forget_me_modal_title_text__c,
          globalAlert_autoSubscribe: config.alert_auto_subscribe_text__c,
          hero_headline: config.banner_text_2__c,
          pageTitle: config.page_title__c,
          roadblock: config.roadblock__c,
          wsGetError: config.ws_get_error__c,
          wsPatchError_body: config.ws_patch_error_body__c,
          wsPatchError_button: config.ws_patch_error_button__c,
          wsPatchError_title: config.ws_patch_error_title__c,
          unsubscribeAll_modal_body: config.unsubscribeall_messagebody__c,
          unsubscribeAll_modal_primaryButton: config.unsubscribeall_confirmbutton__c,
          unsubscribeAll_modal_secondaryButton: config.unsubscribeall_cancelbutton__c,
          unsubscribeAll_modal_title: config.unsubscribeall_messagetitle__c,
          unsubscribeAllAlert_successMessage: config.unsubscribeall_success_alert_message_txt__c,
        },
        theme: {
          borderRadius: config.border_radius__c,
          colors: {
            background: config.background_color_hex_code__c,
            bannerBackground: config.banner_background_color_hex_code__c,
            brandPrimary: config.brand_color_hex_code__c,
            brandSecondary: config.secondary_brand_color_hex_code__c,
            brandSecondaryHover: config.secondary_brand_hover_color_hex_code__c,
            brandTertiary: config.tertiary_brand_color_hex_code__c,
            buttonDefault: config.button_color_hex_code__c,
            buttonHover: config.button_hover_hex_code__c,
            buttonText: config.button_text_color_hex_code__c,
            formCheckActive: config.checkbox_active_color_hex_code__c,
            formCheckActiveHover: config.checkbox_active_hover_color_hex_code__c,
            formCheckDefault: config.checkbox_default_color_hex_code__c,
            formCheckHover: config.checkbox_default_hover_color_hex_code__c,
            formSwitchActive: config.active_toggle_color_hex_code__c,
            formSwitchDefault: config.inactive_toggle_color_hex_code__c,
            formSwitchDisabled: config.disabled_toggle_color_hex_code__c,
            formSwitchHover: config.hover_toggle_color_hex_code__c,
            heroText: config.hero_text_color_hex_code__c,
          },
          fontFamily: config.font_family__c,
          customCss: config.custom_css__c,
        },
      };

      if (config.footer_link_1_text__c && config.footer_link_1_url__c) {
        parsedData.managedContent.links.footer.push({ label: config.footer_link_1_text__c, url: config.footer_link_1_url__c });
      }

      if (config.footer_link_2_text__c && config.footer_link_2_url__c) {
        parsedData.managedContent.links.footer.push({ label: config.footer_link_2_text__c, url: config.footer_link_2_url__c });
      }

      if (config.footer_link_3_text__c && config.footer_link_3_url__c) {
        parsedData.managedContent.links.footer.push({ label: config.footer_link_3_text__c, url: config.footer_link_3_url__c });
      }

      if (config.footer_link_4_text__c && config.footer_link_4_url__c) {
        parsedData.managedContent.links.footer.push({ label: config.footer_link_4_text__c, url: config.footer_link_4_url__c });
      }

      if (config.footer_link_5_text__c && config.footer_link_5_url__c) {
        parsedData.managedContent.links.footer.push({ label: config.footer_link_5_text__c, url: config.footer_link_5_url__c });
      }

      if (config.footer_link_6_text__c && config.footer_link_6_url__c) {
        parsedData.managedContent.links.footer.push({ label: config.footer_link_6_text__c, url: config.footer_link_6_url__c });
      }

      return parsedData;
    };
  }

  /*
   * GET
   * URI: https://ncpc-horizontal.herokuapp.com/package?langBU={{BUSINESS_UNIT}}
   */
  async get() {
    const wsUri = `${this.wsBaseUrl}/packageConfig?langBU=${this.lang}-${this.bu}`;

    const options = {
      method: 'GET',
    };

    return fetch(wsUri, options)
      .then((response) => response.json())
      .then((response) => {
        // if (response.error || response.success === false) {
        //   const endpoint = wsUri;
        //   const message = (response.error ? response.error.message : '');
        //   const status = (response.error ? response.error.status : 200);
        //   const payload = response.data;

        //   this.logger.post(endpoint, message, status, payload);
        // }

        return this.parseResponseObject(response.data);
      })
      .catch((error) => {
        // this.logger.post(wsUri, error, '500');

        throw error;
      });
  }
}

export default ConfigService;
