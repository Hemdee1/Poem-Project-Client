import Layout from "../components/layout";
import "../styles/global.css";
import AppProvider from "../components/context";

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
