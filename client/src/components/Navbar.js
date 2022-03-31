import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useNavigate();

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const rederList = () => {
    if (state) {
      return [
        <li key="6">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black", cursor: "pointer" }}
          >
            search
          </i>
        </li>,
        <li key="0">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="1">
          <Link to="/create">CreatePost</Link>
        </li>,
        <li key="2">
          <Link to="/myfollowingpost">My Follower Post</Link>
        </li>,
        <li key="3">
          <button
            className="btn waves-effect waves-light #42a5f5 red darken-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history("/signin");
            }}
          >
            logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="4">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="5">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  const fetchUser = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUserDetails(result.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {rederList()}
        </ul>
      </div>
      {/* this is the modal from materialize */}

      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content" style={{ color: "black" }}>
          <input
            type="text"
            placeholder="search user"
            value={search}
            onChange={(e) => fetchUser(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  key={item._id}
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            close
          </button>
        </div>
      </div>
      {/* end of the modal from materialize */}
    </nav>
  );
};

export default Navbar;
