import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const CreatePost = () => {
  const formRef = useRef();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (process.browser) {
      setToken(JSON.parse(localStorage.getItem("poem-hub")));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = formRef.current.title.value.trim();
    const bodyData = formRef.current.body.value;
    const cateData = formRef.current.category.value;
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

    if (image.size / (1024 * 1024) > 3) {
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

    const res = await fetch("http://localhost:5000/post", {
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
  };

  return (
    <div className="create">
      <h1 className="title">Post a new poem</h1>
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
          />
          <p>
            <span>Note:</span> Each category should be comma separated, and the
            categories must not be more than <span>five</span>.
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="image">Image:</label>
          <input type="file" name="image" id="image" required />
        </div>
        {error && <p className="error">{error}</p>}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
