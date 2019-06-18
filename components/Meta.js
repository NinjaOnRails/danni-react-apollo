import Head from 'next/head';

const Meta = () => (
  <Head>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${
        process.env.GA_TRACKING_ID
      }`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_TRACKING_ID}');
          `,
      }}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/favicon.png" />
    <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
    <title>Danni</title>
  </Head>
);

export default Meta;
