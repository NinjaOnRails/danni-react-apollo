import Router from 'next/router';
import { trackSignIn, trackSignUp } from '../../lib/mixpanel';
import { CURRENT_USER_QUERY } from '../../graphql/query';

const validateInput = (value, rule) => {
  let isValid = true;
  if (!rule) {
    return true;
  }
  if (rule.required) {
    isValid = value.trim() !== '' && isValid;
  }
  if (rule.minLength) {
    isValid = value.length >= rule.minLength && isValid;
  }
  if (rule.maxLength) {
    isValid = value.length <= rule.maxLength && isValid;
  }
  if (rule.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }
  return isValid;
};

const inputChangeHandler = (e, input, authForm, setAuthForm, setFormValid) => {
  const eventValue = e.target.value;
  const updatedForm = {
    ...authForm,
  };
  const updatedElement = {
    ...updatedForm[input],
  };
  updatedElement.value = eventValue;
  updatedElement.valid = validateInput(
    updatedElement.value,
    updatedElement.validation
  );
  updatedElement.modified = true;
  updatedForm[input] = updatedElement;
  let isFormValid = true;
  Object.keys(updatedForm).forEach(key => {
    isFormValid = updatedForm[key].valid && isFormValid;
  });
  setAuthForm(updatedForm);
  setFormValid(isFormValid);
};

const clearForm = (initialForm, setInitialForm, setFormInvalid) => {
  setInitialForm({ ...initialForm });
  setFormInvalid(false);
};

const onFacebookLoginClick = ({
  facebookLogin,
  contentLanguage,
  client,
  previousPage,
  closeSideDrawer = null,
  closeAuthModal = null,
}) => {
  FB.login(
    async res => {
      if (res.status === 'connected') {
        const {
          authResponse: { accessToken, userID },
        } = res;
        const { data } = await facebookLogin({
          variables: {
            contentLanguage,
            accessToken,
            facebookUserId: userID,
          },
          refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
        if (data) {
          const {
            facebookLogin: { user, firstLogin },
          } = data;
          if (firstLogin) {
            trackSignUp(user);
          } else {
            trackSignIn(user.id);
          }
          if (closeSideDrawer) {
            closeSideDrawer();
          } else if (closeAuthModal) {
            closeAuthModal();
          } else {
            Router.push(
              localStorage.getItem('previousPage') || previousPage || '/'
            );
            localStorage.removeItem('previousPage');
            client.writeData({ data: { previousPage: null } });
          }
        }
      }
    },
    {
      scope: 'public_profile',
    }
  );
};

export { onFacebookLoginClick, clearForm, inputChangeHandler, validateInput };
