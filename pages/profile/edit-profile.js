import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const EditProfile = () => {
  const formRef = useRef();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [datas, setDatas] = useState({
    firstName: "",
    lastName: "",
    penName: "",
    email: "",
    phone: "",
  });

  const fetchData = async (token) => {
    const res = await fetch("http://localhost:5000/user", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setDatas(data);
  };

  useEffect(() => {
    if (process.browser) {
      const token = JSON.parse(localStorage.getItem("poem-hub"));

      setToken(token);
      fetchData(token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const image = formRef.current.image.files[0];

    if (image && image.size / (1024 * 1024) > 3) {
      setError("image size must be less than 3mb");
      return;
    }

    const formData = new FormData();

    formData.append("firstName", datas.firstName);
    formData.append("lastName", datas.lastName);
    formData.append("penName", datas.penName);
    formData.append("email", datas.email);
    formData.append("phone", datas.phone);
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/user/update/", {
      method: "post",
      body: formData,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      // localStorage.setItem("poem-hub", JSON.stringify(data));
      router.push("/profile");
    } else {
      console.log(data.error);
    }
  };

  return (
    <div className="create">
      <h1 className="title">Edit Profile</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="form-control">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            autoComplete="off"
            value={datas.firstName}
            onChange={(e) => setDatas({ ...datas, firstName: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            autoComplete="off"
            value={datas.lastName}
            onChange={(e) => setDatas({ ...datas, lastName: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            value={datas.email}
            disabled
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="penName">Pen Name:</label>
          <input
            type="text"
            name="penName"
            id="penName"
            autoComplete="off"
            value={datas.penName}
            onChange={(e) => setDatas({ ...datas, penName: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="phone">Phone No:</label>
          <input
            type="number"
            name="phone"
            id="phone"
            autoComplete="off"
            value={datas.phone}
            onChange={(e) => setDatas({ ...datas, phone: e.target.value })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="image">Image:</label>
          <input type="file" name="image" id="image" />
        </div>
        {error && <p className="error">{error}</p>}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default EditProfile;
