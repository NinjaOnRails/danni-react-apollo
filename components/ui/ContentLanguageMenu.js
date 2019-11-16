import React, { useState, useEffect } from 'react';
import { Button, Flag } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  getSupportedLanguage,
  flagOptions,
} from '../../lib/supportedLanguages';
import { CONTENT_LANGUAGE_QUERY } from '../../graphql/query';
import fetchVideos from '../../lib/fetchVideos';

const LanguageMenu = ({
  currentUser,
  currentWatchingLanguage,
  addContentLanguage,
  updateContentLanguage,
  client,
  toggleContentLanguage,
  contentLanguage: currentContentLanguage,
  loadingUpdate,
  sideDrawer,
  loadingUser,
  loadingData,

  // currentUser: { contentLanguage },
}) => {
  const [disabled, setDisabled] = useState(false);

  const buttonWidth = sideDrawer ? 2 : 1;

  const updateLocalState = async language => {
    // Update local state
    setDisabled(true);
    const {
      data: {
        toggleContentLanguage: {
          data: { contentLanguage: toggledContentLanguage },
        },
      },
    } = await toggleContentLanguage({
      variables: {
        language,
      },
    });
    setDisabled(false);

    return toggledContentLanguage;
  };

  // If currently watching video of new language, add it
  const onCurrentWatchingLanguage = async () => {
    if (currentWatchingLanguage) {
      // Update Local State
      const { data } = await addContentLanguage({
        variables: { language: currentWatchingLanguage },
      });

      if (!data.addContentLanguage) return;

      let {
        addContentLanguage: {
          data: { contentLanguage: addedContentLanguage },
        },
      } = data;

      await fetchVideos({
        client,
        contentLanguage: addedContentLanguage,
      });

      const { data: newData } = await client.query({
        query: CONTENT_LANGUAGE_QUERY,
      });

      // Check Local State update again due to current Apollo Client bug
      if (newData.contentLanguage.length !== addedContentLanguage.length) {
        addedContentLanguage = await updateLocalState(currentWatchingLanguage);
      }

      // If signed in update db too
      if (currentUser && addContentLanguage) {
        await updateContentLanguage({
          variables: {
            contentLanguage: addedContentLanguage,
          },
        });
      }
    }
  };

  const initFromCurrentUser = () => {
    const { contentLanguage: userContentLanguage } = currentUser;
    if (userContentLanguage.length) {
      localStorage.setItem('contentLanguage', userContentLanguage.join());
      client.writeData({
        data: {
          contentLanguage: userContentLanguage,
        },
      });
    }
  };

  const initFromLocalStorage = languages => {
    return client.writeData({
      data: {
        contentLanguage:
          languages.length === 1 ? languages : languages.split(','),
      },
    });
  };

  const initFromBrowser = async () => {
    // const language = getSupportedLanguage(navigator.language); // User browser's language
    const { data } = await addContentLanguage({
      variables: { language: 'VIETNAMESE' },
    });
    if (data.addContentLanguage)
      return fetchVideos({
        client,
        contentLanguage: data.addContentLanguage.data.contentLanguage,
      });
    return null;
  };

  const onChange = async (e, { name: language }) => {
    // Require min 1 language active
    if (
      currentContentLanguage.length === 1 &&
      currentContentLanguage.includes(language)
    )
      return;

    // Disable buttons
    setDisabled(true);

    // Update Local State
    let contentLanguage = await updateLocalState(language);

    // Refetch data
    await fetchVideos({
      client,
      contentLanguage,
    });

    const { data } = await client.query({ query: CONTENT_LANGUAGE_QUERY });

    // Check Local State update again due to current Apollo Client bug
    if (data.contentLanguage.length !== contentLanguage.length) {
      contentLanguage = await updateLocalState(language);
    }

    // Re-enable buttons
    setDisabled(false);

    // Update user in db
    if (currentUser) {
      updateContentLanguage({
        variables: {
          contentLanguage,
        },
      });
    }
  };

  useEffect(() => {
    const languages = localStorage.getItem('contentLanguage');

    if (currentUser) {
      // Get user's content languages if signed in
      initFromCurrentUser();
      onCurrentWatchingLanguage();
    } else if (languages) {
      // Get content languages from local storage if present
      initFromLocalStorage(languages);
      onCurrentWatchingLanguage();
    } else {
      // Make browser's language default content language
      initFromBrowser().then(() => onCurrentWatchingLanguage());
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      initFromCurrentUser();
    } else {
      initFromBrowser();
    }
  }, [currentUser]);

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
            onClick={onChange}
            active={currentContentLanguage.includes(value)}
            disabled={
              loadingUser ||
              loadingUpdate ||
              !currentContentLanguage.length ||
              loadingData ||
              disabled
            }
          >
            <Flag name={flag} />
            {sideDrawer && text}
          </Button>
        ))}
      </Button.Group>
    </>
  );
};

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
