import React, { Component } from 'react';
import { Button, Flag } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  getSupportedLanguage,
  flagOptions,
} from '../../lib/supportedLanguages';
import {
  ALL_VIDEOS_QUERY,
  ALL_AUDIOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';

class LanguageMenu extends Component {
  state = {
    disabled: false,
  };

  // Determine and set content language from one source
  componentDidMount = () => {
    const { currentUser } = this.props;
    const languages = localStorage.getItem('contentLanguage');

    if (currentUser) {
      // Get user's content languages if signed in
      this.initFromCurrentUser().then(() => this.onCurrentWatchingLanguage());
    } else if (languages) {
      // Get content languages from local storage if present
      this.initFromLocalStorage(languages);
      this.onCurrentWatchingLanguage();
    } else {
      // Make browser's language default content language
      this.initFromBrowser().then(() => this.onCurrentWatchingLanguage());
    }
  };

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

  // If currently watching video of new language, add it
  onCurrentWatchingLanguage = async () => {
    const {
      currentWatchingLanguage,
      addContentLanguage,
      currentUser,
      updateContentLanguage,
      client,
    } = this.props;
    if (currentWatchingLanguage) {
      // Update Local State
      const { data } = await addContentLanguage({
        variables: { language: currentWatchingLanguage },
      });

      if (!data.addContentLanguage) return;

      let {
        addContentLanguage: {
          data: { contentLanguage },
        },
      } = data;

      await this.refetchData(contentLanguage);

      const { data: newData } = await client.query({
        query: CONTENT_LANGUAGE_QUERY,
      });

      // Check Local State update again due to current Apollo Client bug
      if (newData.contentLanguage.length !== contentLanguage.length) {
        contentLanguage = await this.updateLocalState(currentWatchingLanguage);
      }

      // If signed in update db too
      if (currentUser && addContentLanguage) {
        await updateContentLanguage({
          variables: {
            contentLanguage,
          },
        });
      }
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

  initFromBrowser = async () => {
    const { addContentLanguage } = this.props;
    const language = getSupportedLanguage(navigator.language); // User browser's language
    const { data } = await addContentLanguage({ variables: { language } });
    if (data.addContentLanguage)
      return this.refetchData(data.addContentLanguage.data.contentLanguage);
    return null;
  };

  updateLocalState = async language => {
    // Update local state
    const {
      data: {
        toggleContentLanguage: {
          data: { contentLanguage },
        },
      },
    } = await this.props.toggleContentLanguage({
      variables: {
        language,
      },
    });

    return contentLanguage;
  };

  refetchData = async contentLanguage => {
    const { client } = this.props;
    const {
      data: { audios },
    } = await client.query({
      query: ALL_AUDIOS_QUERY,
      variables: { contentLanguage },
    });
    const {
      data: { videos },
    } = await client.query({
      query: ALL_VIDEOS_QUERY,
      variables: { contentLanguage },
    });
    return { audios, videos };
  };

  onChange = async (e, { name: language }) => {
    const {
      currentUser,
      updateContentLanguage,
      contentLanguage: currentContentLanguage,
      client,
    } = this.props;

    // Require min 1 language active
    if (
      currentContentLanguage.length === 1 &&
      currentContentLanguage.includes(language)
    )
      return;

    // Disable buttons
    this.setState({ disabled: true });

    // Update Local State
    let contentLanguage = await this.updateLocalState(language);

    // Refetch data
    await this.refetchData(contentLanguage);

    const { data } = await client.query({ query: CONTENT_LANGUAGE_QUERY });

    // Check Local State update again due to current Apollo Client bug
    if (data.contentLanguage.length !== contentLanguage.length) {
      contentLanguage = await this.updateLocalState(language);
    }

    // Re-enable buttons
    this.setState({ disabled: false });

    // Update user in db
    if (currentUser) {
      updateContentLanguage({
        variables: {
          contentLanguage,
        },
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
          {flagOptions.map(({ key, value, flag, text }) => (
            <Button
              key={key}
              name={value}
              onClick={this.onChange}
              active={contentLanguage.includes(value)}
              disabled={
                loadingUser ||
                loadingUpdate ||
                !contentLanguage.length ||
                loadingData ||
                this.state.disabled
              }
            >
              <Flag name={flag} />
              {sideDrawer && text}
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
