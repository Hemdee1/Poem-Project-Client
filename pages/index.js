import PoemCard from "../components/poemCard";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import Router from "next/router";
import { useGlobalContext } from "../components/context";

// export const getStaticProps = async () => {
//   const res = await fetch("http://localhost:5000/post");
//   const data = await res.json();

//   return { props: { data } };
// };

const Home = () => {
  const [data, setData] = useState([]);

  const fetchData = async (token) => {
    const res = await fetch("http://localhost:5000/post", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    // redirect if token is expired!!!
    if (!res.ok) {
      if (data.error === "Request is not authorized") {
        localStorage.removeItem("poem-hub");
        return Router.replace("/login");
      }
    }

    setData(data);
  };

  useEffect(() => {
    if (process.browser) {
      const token = JSON.parse(localStorage.getItem("poem-hub"));

      if (token) {
        fetchData(token);
      } else {
        Router.push("login");
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Poem Hub | Home</title>
        <meta name="keywords" content="poems" />
      </Head>
      <div className="Home">
        <h1 className="title">All Poems</h1>

        <div className="poem-container">
          {data.map((poem, index) => (
            <PoemCard key={index} poem={poem} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
