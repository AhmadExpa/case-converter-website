import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const locale = this.props.locale || 'en';
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
      <Html lang={locale} dir={dir}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
