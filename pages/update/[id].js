import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const updatePost = () => {
  const formRef = useRef();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [id, setId] = useState();

  const [error, setError] = useState("");
  const [data, setData] = useState({
    title: "",
    body: "",
    category: "",
  });

  const fetchData = async (token, id) => {
    const res = await fetch("http://localhost:5000/post/" + id, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const body = data.body.join("\n");
    const category = data.category.join(", ");

    setData({ ...data, body, category });
  };

  useEffect(() => {
    if (!router.isReady) return;

    const token = JSON.parse(localStorage.getItem("poem-hub"));
    setToken(token);
    const { id } = router.query;

    setId(id);
    setToken(token);
    fetchData(token, id);
  }, [router.isReady]);

  const sendData = async (formData) => {
    const res = await fetch("http://localhost:5000/post/update/" + id, {
      method: "post",
      body: formData,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      formRef.current.reset;
      router.push("/");
    } else {
      console.log(data.error);
    }

    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = data.title;
    const bodyData = data.body;
    const cateData = data.category;
    const image = formRef.current.image.files[0];

    const body = bodyData.split("\n").map((item) => item.trim());
    const category = cateData
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    if (category.length > 5) {
      setError("Category is greater than 5");
      return;
    }

    if (image && image.size / (1024 * 1024) > 3) {
      setError("image size must be less than 3mb");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("image", image);

    body.forEach((data) => {
      formData.append("body", data);
    });
    category.forEach((data) => {
      formData.append("category", data);
    });

    sendData(formData);
  };

  return (
    <div className="create">
      <h1 className="title">Update your poem</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="form-control">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            autoComplete="off"
            required
            placeholder="Enter the title of the poem"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="body">Body:</label>
          <textarea
            name="body"
            id="body"
            rows="6"
            required
            placeholder="Enter the body of the poem"
            value={data.body}
            onChange={(e) => setData({ ...data, body: e.target.value })}
          ></textarea>
          <p>
            <span>Note:</span> Press the <span>Enter key</span> to move to the
            next line.
          </p>
          <p>
            <span>Note:</span> Press the <span>Enter key twice</span> to start a
            new stanza on the next line.
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            name="category"
            id="category"
            autoComplete="off"
            required
            placeholder="e.g Love, Romance, Feelings"
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
          />
          <p>
            <span>Note:</span> Each category should be comma separated, and the
            categories must not be more than <span>five</span>.
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="image">Image:</label>
          <input type="file" name="image" id="image" />
          <p>
            <span>Note:</span> Leave the image blank if you are not planning to
            change it.
          </p>
        </div>
        {error && <p className="error">{error}</p>}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default updatePost;
