import Head from "next/head";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import PoemCard from "../../components/poemCard";
import { useRouter } from "next/router";
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

const Profile = () => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const { poems } = useGlobalContext();

  const fetchData = async (token, id) => {
    const res = await fetch("http://localhost:5000/user/" + id, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setUser(data);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const token = JSON.parse(localStorage.getItem("poem-hub"));
    const { user } = router.query;

    fetchData(token, user);
  }, [router.isReady]);

  const userPoems = poems.filter((poem) => poem.user_id === user?._id);

  return (
    <>
      <Head>
        <title>
          Poem Hub | {user?.firstName} {user?.lastName}
        </title>
      </Head>

      <div className="profile">
        <h1 className="title">{user?.penName} Profile</h1>
        <div className="cont form-control">
          <div className="img-cont">
            {user?.image ? (
              <img src={"http://localhost:5000/" + user?.image} alt="" />
            ) : (
              <FaUser />
            )}
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
          <h1 className="title">{user?.penName} Poems</h1>
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
