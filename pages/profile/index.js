import Head from "next/head";
import { useEffect, useState } from "react";
import { FaPen, FaUser } from "react-icons/fa";
import PoemCard from "../../components/poemCard";
import Link from "next/link";
import { useGlobalContext } from "../../components/context";

const Profile = () => {
  const [user, setUser] = useState({});
  const { logOut, poems } = useGlobalContext();

  const fetchData = async (token) => {
    const res = await fetch("http://localhost:5000/user", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setUser(data);
  };

  useEffect(() => {
    if (process.browser) {
      const token = JSON.parse(localStorage.getItem("poem-hub"));

      fetchData(token);
    }
  }, []);

  const userPoems = poems.filter((poem) => poem.user_id === user?._id);

  return (
    <>
      <Head>
        <title>
          Poem Hub | {user?.firstName} {user?.lastName}
        </title>
      </Head>

      <div className="profile">
        <h1 className="title">My Profile</h1>
        <div className="cont form-control">
          <div className="img-cont">
            {user?.image ? (
              <img src={"http://localhost:5000/" + user?.image} alt="" />
            ) : (
              <FaUser />
            )}
          </div>

          <div className="buttons">
            <Link href="/profile/edit-profile">
              <a>
                <button className="btn">
                  Edit <FaPen />
                </button>
              </a>
            </Link>

            <button className="btn" onClick={logOut}>
              Logout
            </button>
          </div>

          <div className="content">
            {user.firstName && (
              <h1>
                First Name: <span>{user?.firstName}</span>
              </h1>
            )}
            {user.lastName && (
              <h1>
                Last Name: <span>{user?.lastName}</span>
              </h1>
            )}
            {user.email && (
              <h1>
                Email : <span>{user?.email}</span>
              </h1>
            )}
            {user.phone && (
              <h1>
                Phone No : <span>{user?.phone}</span>
              </h1>
            )}
            {user.penName && (
              <h1>
                Pen Name : <span>{user?.penName}</span>
              </h1>
            )}
          </div>
        </div>

        {/* more poems */}
        <div className="more-poems">
          <h1 className="title">My Poems</h1>
          <div className="more">
            {userPoems.map((item, index) => (
              <PoemCard key={index} poem={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
