import Document, { Head, Html, Main, NextScript } from 'next/document';
import { GoogleTagManagerNoScript } from '../components/GoogleTagManager';

class MyDocument extends Document {
  render() {
    const locale = this.props.locale || 'en';
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
    const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

    return (
      <Html lang={locale} dir={dir}>
        <Head>
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
          <meta name="application-name" content="QuickTextFormatter" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="QuickTextFormatter" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="theme-color" content="#ea580c" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="author" content="QuickTextFormatter" />
          {googleVerification ? <meta name="google-site-verification" content={googleVerification} /> : null}
          {bingVerification ? <meta name="msvalidate.01" content={bingVerification} /> : null}
        </Head>
        <body>
          <GoogleTagManagerNoScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
