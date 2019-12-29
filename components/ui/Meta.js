import Head from 'next/head';

const Meta = () => (
  <Head>
    <title key="title">Danni TV - Trang chủ</title>
    <meta key="metaTitle" name="title" content="Danni TV - Trang chủ" />
    {/* <meta
      key="description"
      name="description"
      content="Free videos on education, science, health, business and tech in multiple languages. Globalized smart entertainment platform."
    />
    <meta
      name="keywords"
      content="Danni TV, danni.tv, Different, Global, Languages, Translate, Dub, Dubbed, Voice-over, Free, Videos, TV, Online, Lecture, Lesson, Learn, Health, Science, Business"
    /> */}
    <meta
      key="description"
      name="description"
      content="Thư viện video thuyết minh Tiếng Việt bao gồm các chủ đề như giáo dục, khoa học, sức khoẻ, tâm lý, kinh tế và công nghệ."
    />
    <meta
      name="keywords"
      content="Danni TV, danni.tv, Toàn cầu, Dịch, Lồng tiếng, Thuyết minh, Miễn phí, Video, Phim, Phim ngắn, TV, Online, Trực tuyến, Học
      Toan cau, Ngon ngu, Dich, Long, Long tieng, Thuyet minh, Mien phi, Truc tuyen, Phim, Phim ngan, Hoc,
       Toancau, Ngonngu, Longtieng, Thuyetminh, Mienphi, Tructuyen, Phimngan
      "
    />
    <meta name="HandheldFriendly" content="True" />
    <meta name="application-name" content="Danni TV" />
    <meta name="apple-mobile-web-app-title" content="Danni TV" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />

    <meta property="fb:app_id" content="398428117464454" />
    <meta property="og:title" content="Danni TV" key="og:title" />
    <meta
      property="og:description"
      content="Thư viện video thuyết minh Tiếng Việt bao gồm các chủ đề như giáo dục, khoa học, sức khoẻ, tâm lý, kinh tế và công nghệ."
      key="og:description"
    />
    <meta
      key="og:image"
      property="og:image"
      content="https://res.cloudinary.com/danni/image/upload/v1573162609/btluys8ednhxpolg868s.jpg"
    />
    <meta property="og:type" content="website" key="og:type" />
    <meta property="og:url" content="https://danni.tv/" key="og:url" />
    {/* <meta
      property="og:description"
      content="Free videos on education, science, health, business and tech in multiple languages. Globalized smart entertainment platform."
      key="og:description"
    /> */}

    <link rel="canonical" href="https://www.danni.tv/" />
    <link rel="shortcut icon" type="image/png" href="/static/favicon.png" />
    <link rel="icon" type="image/png" href="/static/favicon.png" />
    <link rel="apple-touch-icon" href="/static/favicon.png" />
    <link
      rel="stylesheet"
      href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
    />
    <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,700&amp;display=swap&amp;subset=vietnamese"
    />

    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
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
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,
        0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
        for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
        MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
        mixpanel.init("2502a5dd8ce4ec0c6ddf762c70af9637")
      `,
      }}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
        window.purechatApi = { l: [], t: [], on: function () { this.l.push(arguments); } }; (function () { var done = false; var script = document.createElement('script'); script.async = true; script.type = 'text/javascript'; script.src = 'https://app.purechat.com/VisitorWidget/WidgetScript'; document.getElementsByTagName('HEAD').item(0).appendChild(script); script.onreadystatechange = script.onload = function (e) { if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) { var w = new PCWidget({c: '4ae7c825-1b22-432d-b5f4-fb4fddd582d3', f: true }); done = true; } }; })();
      `,
      }}
    />
  </Head>
);

export default Meta;
