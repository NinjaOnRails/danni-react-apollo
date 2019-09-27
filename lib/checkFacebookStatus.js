export default () => {
  let fbStatus = null;
  if (typeof window !== 'undefined') {
    FB.getLoginStatus(({ status }) => (fbStatus = status));
  }
  return fbStatus === 'connected';
};
