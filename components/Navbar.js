import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch, FaUser, FaInfo } from "react-icons/fa";
import { useGlobalContext } from "./context";

const Navbar = () => {
  const { user, logOut } = useGlobalContext();
  const [openNav, setOpenNav] = useState(false);

  const handleLogout = () => {
    setOpenNav(false);
    logOut();
  };

  return (
    <nav>
      <Link href="/">
        <a>
          <h1 className="nav">
            Poem <span>Hub</span>
          </h1>
        </a>
      </Link>

      {user && (
        <div
          className={openNav ? "bar active" : "bar"}
          onClick={() => setOpenNav((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {user && (
        <div className={openNav ? "links active" : "links"}>
          <Link href="/about">
            <a onClick={() => setOpenNav(false)}>
              About <FaInfo />
            </a>
          </Link>
          <Link href="/search">
            <a onClick={() => setOpenNav(false)}>
              Search
              <FaSearch />
            </a>
          </Link>
          <Link href="/profile">
            <a onClick={() => setOpenNav(false)}>
              Profile <FaUser />
            </a>
          </Link>
          <Link href="/create">
            <a onClick={() => setOpenNav(false)}>
              <button className="btn">Post</button>
            </a>
          </Link>
          <div className="user">
            <div className="img-cont">
              {user?.image ? (
                <img src={"http://localhost:5000/" + user?.image} alt="" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="option">
              <h1>{user?.penName}</h1>
              <h1>{user?.email}</h1>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
