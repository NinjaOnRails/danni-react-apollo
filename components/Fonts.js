import FontFaceObserver from 'fontfaceobserver';

const Fonts = () => {
  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap&subset=vietnamese';
  link.rel = 'stylesheet';

  document.head.appendChild(link);

  const roboto = new FontFaceObserver('IBM Plex Sans');

  roboto.load().then(() => {
    document.documentElement.classList.add('roboto');
  });
};

export default Fonts;
