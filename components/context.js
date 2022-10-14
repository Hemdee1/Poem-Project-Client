import Router from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const Appcontext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [poems, setPoems] = useState([]);
  const [token, setToken] = useState("");

  const fetchUser = async (token) => {
    const res = await fetch("http://localhost:5000/user", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.error === "Request is not authorized") {
        localStorage.removeItem("poem-hub");
        return Router.replace("/login");
      }
    }
    setUser(data);
  };

  const fetchPoems = async (token) => {
    const res = await fetch("http://localhost:5000/post", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      return;
    }

    setPoems(data);
  };

  console.log(poems);

  const logOut = () => {
    localStorage.removeItem("poem-hub");
    setUser(undefined);
    Router.replace("/login");
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("poem-hub"));

    if (!token) {
      Router.replace("/login");
    } else {
      setToken(token);
      fetchUser(token);
      fetchPoems(token);
    }
  }, []);

  return (
    <Appcontext.Provider
      value={{ user, logOut, setUser, fetchUser, poems, token }}
    >
      {children}
    </Appcontext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(Appcontext);
};

export default AppProvider;
