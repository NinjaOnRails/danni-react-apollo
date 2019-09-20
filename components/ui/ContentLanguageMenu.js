import React, { Component } from 'react';
import { Button, Flag } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  getSupportedLanguage,
  languageOptions,
  languageOptionsLocal,
  flagOptions,
} from '../../lib/supportedLanguages';
import { ALL_VIDEOS_QUERY, ALL_AUDIOS_QUERY } from '../../graphql/query';

class LanguageMenu extends Component {
  // Determine and set content language from one source
  componentDidMount() {
    const { currentWatchingLanguage, currentUser } = this.props;
    const languages = localStorage.getItem('contentLanguage');

    if (currentUser) {
      // Get user's content languages if signed in
      this.initFromCurrentUser();
    } else if (languages) {
      // Get content languages from local storage if present
      this.initFromLocalStorage(languages);
    } else {
      // Make browser's language default content language
      this.initFromBrowser();
    }
    // If currently watching video of new language, add it
    if (currentWatchingLanguage) {
      this.onCurrentWatchingLanguage(currentWatchingLanguage);
    }
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

  onCurrentWatchingLanguage = async currentWatchingLanguage => {
    const {
      addContentLanguage,
      currentUser,
      updateContentLanguage,
    } = this.props;
    const { data } = await addContentLanguage({
      variables: { language: currentWatchingLanguage },
    });
    // If signed in update db too
    if (currentUser && data.addContentLanguage) {
      await updateContentLanguage({
        variables: {
          contentLanguage: data.addContentLanguage.data.contentLanguage,
        },
      });
    }
  };

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

  onChange = async e => {
    const {
      currentUser,
      updateContentLanguage,
      toggleContentLanguage,
      contentLanguage,
      client,
    } = this.props;

    // Require min 1 language active
    if (contentLanguage.length === 1 && contentLanguage.includes(e.target.id))
      return;

    // Update local state
    const {
      data: {
        toggleContentLanguage: { data },
      },
    } = await toggleContentLanguage({
      variables: {
        language: e.target.id,
      },
    });

    // Update user in db
    if (currentUser) {
      await updateContentLanguage({
        variables: {
          contentLanguage: data.contentLanguage,
        },
      });
    }

    // Reload page
    if (data && location.pathname === '/') {
      client.writeData({ data: { reloadingPage: true } });
      location.reload();
    } else {
      // Refetch data
      client.query({
        query: ALL_AUDIOS_QUERY,
        variables: { contentLanguage: data.contentLanguage },
      });
      client.query({
        query: ALL_VIDEOS_QUERY,
        variables: { contentLanguage: data.contentLanguage },
      });
    }
  };

  render() {
    const {
      contentLanguage,
      loadingUpdate,
      sideDrawer,
      loadingUser,
      loadingData,
      reloadingPage,
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
              onClick={this.onChange}
              id={languageOptions[value]}
              active={contentLanguage.includes(languageOptions[value])}
              disabled={
                loadingUser ||
                loadingUpdate ||
                !contentLanguage.length ||
                loadingData ||
                reloadingPage
              }
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
  addContentLanguage: PropTypes.func.isRequired,
  updateContentLanguage: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  contentLanguage: PropTypes.array.isRequired,
  loadingUpdate: PropTypes.bool,
  loadingUser: PropTypes.bool.isRequired,
  reloadingPage: PropTypes.bool.isRequired,
  loadingData: PropTypes.bool,
  sideDrawer: PropTypes.bool,
  currentWatchingLanguage: PropTypes.string,
};

LanguageMenu.defaultProps = {
  currentUser: null,
  loadingUpdate: false,
  sideDrawer: false,
  currentWatchingLanguage: null,
  loadingData: true,
};

export default LanguageMenu;
