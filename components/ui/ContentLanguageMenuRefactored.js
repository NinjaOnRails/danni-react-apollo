import React, { useState, useEffect } from 'react';
import { Button, Flag } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { flagOptions } from '../../lib/supportedLanguages';
import { CONTENT_LANGUAGE_QUERY } from '../../graphql/query';
import fetchAudiosVideos from '../../lib/fetchAudiosVideos';

const LanguageMenu = (
  {
    currentUser,
    contentLanguage: currentContentLanguage,
    currentWatchingLanguage,
    addContentLanguage,
    updateContentLanguage,
    client,
    loadingUpdate,
    sideDrawer,
    loadingUser,
    loadingData,
    toggleContentLanguage,
    currentUser: { contentLanguage },
  }
) => {
  const [disabled, setDisabled] = useState(false);

  const buttonWidth = sideDrawer ? 2 : 1;

  // If currently watching video of new language, add it

  const initFromCurrentUser = () => {

    if (contentLanguage.length) {
      localStorage.setItem('contentLanguage', contentLanguage.join());
      client.writeData({
        data: {
          contentLanguage,
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
      return fetchAudiosVideos({
        client,
        contentLanguage: data.addContentLanguage.data.contentLanguage,
      });
    return null;
  };

  const updateLocalState = async language => {
    // Update local state
    const {
      data: {
        toggleContentLanguage: {
          data: { contentLanguage },
        },
      },
    } = await toggleContentLanguage({
      variables: {
        language,
      },
    });

    return contentLanguage;
  };
  const onCurrentWatchingLanguage = async () => {
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

      await fetchAudiosVideos({ client, contentLanguage });

      const { data: newData } = await client.query({
        query: CONTENT_LANGUAGE_QUERY,
      });

      // Check Local State update again due to current Apollo Client bug
      if (newData.contentLanguage.length !== contentLanguage.length) {
        contentLanguage = await updateLocalState(currentWatchingLanguage);
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
    await fetchAudiosVideos({ client, contentLanguage });

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
    console.log('effect');
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
  }, [currentUser]);

  // useEffect(() => {
  //   console.log('effect');
  //   if (
  //     (currentUser && !prevProps.currentUser) ||
  //     (currentUser &&
  //       prevProps.currentUser &&
  //       currentUser.id !== prevProps.currentUser.id)
  //   )
  //     initFromCurrentUser();

  //   // Update on sign out
  //   if (!currentUser && prevProps.currentUser) initFromBrowser();
  // }, [currentUser]);
  const {
    currentUser: { contentLanguage },
  } = props;
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
            active={contentLanguage.includes(value)}
            disabled={
              loadingUser ||
              loadingUpdate ||
              !contentLanguage.length ||
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
