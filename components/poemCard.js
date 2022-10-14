import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaBookOpen, FaHeart, FaCommentAlt, FaUser } from "react-icons/fa";
import { useGlobalContext } from "./context";

const PoemCard = ({ poem }) => {
  const [data, setData] = useState({});
  const [createdAt, setCreatedAt] = useState(Date.now());

  const { user } = useGlobalContext();

  useEffect(() => {
    if (poem) {
      setData(poem);
      setCreatedAt(poem.createdAt);
    }
  }, [poem]);

  const {
    _id,
    user_id,
    title,
    category,
    image,
    user_image,
    user_penName,
    likes,
    comments,
    read,
  } = data;
  const dateAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <article>
      <Link href={"/poem/" + encodeURIComponent(_id)}>
        <a>
          <Image
            src={`http://localhost:5000/` + image}
            alt={title}
            width={300}
            height={160}
            className="poem-img"
          />
        </a>
      </Link>
      <div className="content">
        <div className="img">
          <Link
            href={
              user_id === user?._id
                ? "/profile"
                : "/profile/" + encodeURIComponent(user_id)
            }
          >
            <a>
              {user_image ? (
                <Image
                  src={`http://localhost:5000/` + user_image}
                  height="100%"
                  width="100%"
                />
              ) : (
                <FaUser />
              )}
            </a>
          </Link>
        </div>
        <div className="user">
          <Link href={"/poem/" + encodeURIComponent(_id)}>
            <a>
              <h3>{title}</h3>
            </a>
          </Link>
          <h4>{user_penName}</h4>
        </div>
        <div className="time">
          <span>{dateAgo}</span>
          {/* comment and like */}
          <div className="opt">
            <span>
              <FaBookOpen /> <p>{read?.length}</p>
            </span>
            <span>
              <FaHeart /> <p>{likes?.length}</p>
            </span>
            <span>
              <FaCommentAlt /> <p>{comments?.length}</p>
            </span>
          </div>
        </div>
      </div>
      <div className="cate">
        {category &&
          category.map((item, index) => <span key={index}>{item}</span>)}
      </div>
    </article>
  );
};

export default PoemCard;
