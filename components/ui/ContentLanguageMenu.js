import React, { Component } from 'react';
import { Button, Flag } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  getSupportedLanguage,
  languageOptions,
  languageOptionsLocal,
  flagOptions,
} from '../../lib/supportedLanguages';

class LanguageMenu extends Component {
  // Determine and set content language from one source
  componentDidMount() {
    // Get user's content languages if signed in
    const { currentUser } = this.props;
    if (currentUser) return this.initFromCurrentUser();

    // Get content languages from local storage if present
    const languages = localStorage.getItem('contentLanguage');
    if (languages) return this.initFromLocalStorage(languages);

    // Make browser's language default content language
    return this.initFromBrowser();
  }

  componentDidUpdate(prevProps) {
    const { currentUser } = this.props;
    // Update on sign in
    if (
      (currentUser && !prevProps.currentUser) ||
      (currentUser &&
        prevProps.currentUser &&
        currentUser.id !== prevProps.currentUser.id)
    )
      this.initFromCurrentUser();

    // Update on sign out
    if (!currentUser && prevProps.currentUser) this.initFromBrowser();
  }

  initFromCurrentUser = () => {
    const {
      client,
      currentUser: { contentLanguage },
    } = this.props;
    if (contentLanguage.length) {
      localStorage.setItem('contentLanguage', contentLanguage.join());
      client.writeData({
        data: {
          contentLanguage,
        },
      });
    }
  };

  initFromLocalStorage = languages => {
    const { client } = this.props;
    return client.writeData({
      data: {
        contentLanguage:
          languages.length === 1 ? languages : languages.split(','),
      },
    });
  };

  initFromBrowser = () => {
    const { toggleContentLanguage } = this.props;
    const language = getSupportedLanguage(navigator.language); // User browser's language
    return toggleContentLanguage({ variables: { language } });
  };

  onChange = async (e, toggleContentLanguage, contentLanguage) => {
    const { currentUser, updateContentLanguage } = this.props;

    // Require min 1 language active
    if (contentLanguage.length === 1 && contentLanguage.includes(e.target.id))
      return;

    // Update local state
    const res = await toggleContentLanguage({
      variables: {
        language: e.target.id,
      },
    });

    // Update user in db
    if (currentUser) {
      await updateContentLanguage({
        variables: {
          contentLanguage: res.data.toggleContentLanguage.data.contentLanguage,
        },
      });
    }
  };

  render() {
    const {
      toggleContentLanguage,
      contentLanguage,
      loadingUpdate,
      sideDrawer,
    } = this.props;
    const buttonWidth = sideDrawer ? 2 : 1;
    return (
      <>
        <Button.Group
          basic
          icon
          toggle
          size="big"
          vertical={sideDrawer}
          widths={buttonWidth}
        >
          {flagOptions.map(({ key, value, flag }) => (
            <Button
              key={key}
              onClick={e =>
                this.onChange(e, toggleContentLanguage, contentLanguage)
              }
              id={languageOptions[value]}
              active={contentLanguage.includes(languageOptions[value])}
              disabled={loadingUpdate}
            >
              <Flag name={flag} id={languageOptions[value]} />
              {sideDrawer && languageOptionsLocal[value]}
            </Button>
          ))}
        </Button.Group>
      </>
    );
  }
}

LanguageMenu.propTypes = {
  toggleContentLanguage: PropTypes.func.isRequired,
  updateContentLanguage: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  contentLanguage: PropTypes.array.isRequired,
  loadingUpdate: PropTypes.bool,
  sideDrawer: PropTypes.bool,
};

LanguageMenu.defaultProps = {
  currentUser: null,
  loadingUpdate: false,
  sideDrawer: false,
};

export default LanguageMenu;
