import { useRef, useState } from "react";
import Router from "next/router";
import { useGlobalContext } from "../components/context";

const Signup = () => {
  // const router = useRouter()
  const formRef = useRef();
  const [error, setError] = useState("");
  const { fetchUser } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formRef.current.email.value.trim();
    const firstName = formRef.current.firstName.value.trim();
    const lastName = formRef.current.lastName.value.trim();
    const password = formRef.current.password.value.trim();
    const cpassword = formRef.current.cpassword.value.trim();

    if (password !== cpassword) {
      setError("Password doesn't match!");
      return;
    }

    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "post",
      body: JSON.stringify({ email, firstName, lastName, password }),
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
      <h1 className="title">Sign Up</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="form-control">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" name="firstName" id="firstName" required />

          <label htmlFor="lastName">Last Name:</label>
          <input type="text" name="lastName" id="lastName" required />

          <label htmlFor="email">Email:</label>
          <input type="name" name="email" id="email" required />

          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" required />

          <label htmlFor="cpassword">Confirm Password:</label>
          <input type="password" name="cpassword" id="cpassword" required />

          <div className="note">
            <p>
              <span>Note:</span> Password must contain:
            </p>
            <p>
              A minimum of 8 characters, a lowercase letter, an uppercase
              letter, a number and a symbol
            </p>
            {/* <ul>
              <li>A minimum of 8 characters!</li>
              <li>At least one lowercase letter!</li>
              <li>At least one uppercase letter!</li>
              <li>At least one number!</li>
              <li>At least one symbol!</li>
            </ul> */}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Signup;
