import { Analytics } from "@vercel/analytics/react";
import "normalize.css/normalize.css";
import "../styles/index.css";
import "../styles/App.css";

import Head from "next/head";

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>GitHub Contributions for Bento</title>
      <meta
        name="description"
        content="Generate a Bento tile to display your latest GitHub contributions!"
      />
    </Head>
    <Component {...pageProps} />
    <Analytics />
  </>
);

export default App;
