import { useRef, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { useGlobalContext } from "../components/context";

const Login = () => {
  const { fetchUser } = useGlobalContext();
  const formRef = useRef();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formRef.current.email.value.trim();
    const password = formRef.current.password.value.trim();

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      localStorage.setItem("poem-hub", JSON.stringify(data));
      fetchUser(data);
      setError("");
      Router.push("/");
    }
  };

  return (
    <div className="login">
      <h1 className="title">Login</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="form-control">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" />

          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" />
        </div>
        {error && <p className="error">{error}</p>}
        <button>Submit</button>
      </form>
      <p>Don't have an account yet?</p>
      <Link href="/signup">
        <a>Sign up here</a>
      </Link>
    </div>
  );
};

export default Login;
