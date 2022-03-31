import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  // const [showFollow, setShowFollow] = useState(true);
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  // console.log(state);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      });
    return () => {
      setProfile(null);
      console.log("user profile unmounted");
    };
  }, [userid]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div className="heading">
          <div className="profile-container">
            <div>
              <img
                src={userProfile.user.pic}
                className="profile-img"
                alt="profile"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>

              {showFollow ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  unfollow
                </button>
              )}

              <div className="profile-tags">
                <h5>{userProfile.posts.length} post</h5>
                <h5>{userProfile.user.followers.length} followers</h5>
                <h5>{userProfile.user.following.length} following</h5>
              </div>
            </div>
          </div>
          <div className="gallary">
            {userProfile.posts?.map((pic) => (
              <img
                key={pic._id}
                src={pic.photo}
                className="item"
                alt={pic.title}
              />
            ))}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default UserProfile;
