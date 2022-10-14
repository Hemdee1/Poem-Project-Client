import { comments, poems } from "../../components/data";
import PoemCard from "../../components/poemCard";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaBookOpen, FaHeart, FaShare, FaTimes, FaUser } from "react-icons/fa";
import { useGlobalContext } from "../../components/context";

// export const getStaticPaths = async () => {
//   const res = await fetch("http://localhost:5000/post");
//   const datas = await res.json();

//   const paths = datas.map((data) => {
//     return { params: { id: data._id.toString() } };
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps = async (context) => {
//   const id = context.params.id;
//   const res = await fetch("http://localhost:5000/post/" + id);
//   const data = await res.json();

//   return { props: { data } };
// };

const PoemDetail = () => {
  const [data, setData] = useState({});
  const router = useRouter();
  const [id, setId] = useState("");
  const [token, setToken] = useState("");

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const commentRef = useRef();
  const [like, setLike] = useState([]);
  const [openPic, setOpenPic] = useState(false);

  const { user, poems } = useGlobalContext();

  const checkRead = async (token, id) => {
    const res = await fetch("http://localhost:5000/post/read/" + id, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setData(data);
  };

  const fetchData = async (token, id) => {
    const res = await fetch("http://localhost:5000/post/" + id, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setData(data);
    setComments(data.comments);
    setLike(data.likes);

    if (!data.read.includes(user._id)) {
      checkRead(token, id);
    }
  };

  useEffect(() => {
    // if (!router.isReady) return;
    if (!user) return;

    const token = JSON.parse(localStorage.getItem("poem-hub"));
    const { id } = router.query;

    setId(id);
    setToken(token);
  }, [user, router.query]);

  useEffect(() => {
    if (!id) return;

    fetchData(token, id);
  }, [token, id]);

  const handleDelete = async () => {
    const res = await fetch("http://localhost:5000/post/" + id, {
      method: "delete",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.push("/");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    const comment = user.penName + ": " + commentText.trim();

    const res = await fetch("http://localhost:5000/post/comment/" + id, {
      method: "post",
      body: JSON.stringify({ comment }),
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data.error);
    }
    setComments((prev) => [...prev, comment]);
    setCommentText("");

    if (data.comments.length > 5) {
      // commentRef.current.scrollTop = commentRef.current.scrollHeight;
      commentRef.current.scroll({
        top: commentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleLike = async () => {
    const user_id = user._id;

    const res = await fetch("http://localhost:5000/post/like/" + id, {
      method: "post",
      body: JSON.stringify({ user_id }),
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data.error);
    }
    setLike((prev) => {
      if (prev.includes(user_id)) {
        return prev.filter((item) => item !== user_id);
      } else {
        return [...prev, user_id];
      }
    });
  };

  const {
    _id,
    user_id,
    body,
    title,
    category,
    image,
    read,
    user_image,
    user_penName,
    createdAt,
  } = data;

  const userPoems = poems.filter((poem) => poem.user_id === user_id);
  const date = new Date(createdAt);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return (
    <>
      <Head>
        <title>Poem Hub | {title}</title>
        <meta name="keywords" content={"poem " + title} />
      </Head>

      <section className="poem-detail">
        <div className="nav">
          <h1 className="title">{title}</h1>
          <div className="poet">
            <Link
              href={
                user_id === user?._id
                  ? "/profile"
                  : "/profile/" + encodeURIComponent(user_id)
              }
            >
              <a>By {user_penName}</a>
            </Link>
            <Link
              href={
                user_id === user?._id
                  ? "/profile"
                  : "/profile/" + encodeURIComponent(user_id)
              }
            >
              <a>
                {user_image ? (
                  <img
                    src={`http://localhost:5000/` + user_image}
                    alt={title}
                  />
                ) : (
                  <FaUser className="user" />
                )}
              </a>
            </Link>
          </div>

          <p>
            {day} / {month} / {year}
          </p>
          {/* update and delete button  */}
          {user_id === user?._id && (
            <div className="button">
              <Link href={"/update/" + _id}>
                <a className="btn">Update</a>
              </Link>
              <button className="btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="container">
          <div className="img-cont">
            <img
              src={`http://localhost:5000/` + image}
              alt={title}
              onClick={() => setOpenPic(true)}
            />
            <small>Click on the image for fullscreen view.</small>
          </div>
          <div className="text">
            {body?.map((poem, index) => (
              <p key={index} className={poem?.length < 1 ? "space" : ""}>
                {poem}
              </p>
            ))}
          </div>
        </div>
        <div className="options-cont">
          <div className="options">
            <span>
              <FaBookOpen />
              <h5>{read?.length}</h5>
            </span>
            <span>
              <FaHeart
                className={like.includes(user?._id) ? "love active" : "love"}
                onClick={handleLike}
              />
              <h5>{like.length}</h5>
            </span>
            <span>
              <FaShare />
              <h5>0</h5>
            </span>
          </div>

          <div className="cate">
            <h3 className="cate">Categories:</h3>
            <div className="category">
              {category?.map((item, index) => (
                <span key={index} className="form-control">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/*  */}

        {/* comments */}
        <h1 className="title comment-title">Comments</h1>
        <div className="comment">
          <form className="comment-box form-control" onSubmit={handleComment}>
            <label htmlFor="comment">Post a comment</label>
            <textarea
              name="comment"
              id="comment"
              rows="3"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button>Submit</button>
          </form>
          <div className="comment-text">
            <div className="texts" ref={commentRef}>
              {comments?.map((c, index) => {
                const comment = c.split(":");

                return (
                  <p key={index}>
                    <span>{comment[0]}:</span> {comment[1]}
                  </p>
                );
              })}
              {comments?.length < 1 && (
                <span>There is no comment yet.....</span>
              )}
            </div>
          </div>
        </div>
        {/* more poems */}
        <div className="more-poems">
          <h1 className="title">
            More poems from <span>{user_penName}</span>
          </h1>
          <div className="more">
            {userPoems?.map((item, index) => (
              <PoemCard key={index} poem={item} />
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE POPUP */}
      <div className={openPic ? "popup open" : "popup"}>
        <img src={`http://localhost:5000/` + image} alt={title} />
        <FaTimes onClick={() => setOpenPic(false)} />
      </div>
    </>
  );
};

export default PoemDetail;
