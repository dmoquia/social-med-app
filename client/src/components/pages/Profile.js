import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [post, setPost] = useState([]);
  const [image, setImage] = useState("");
  // const [url, setUrl] = useState("");

  const { state, dispatch } = useContext(UserContext);
  // console.log(state);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setPost(result);
      });
    return () => {
      setPost(null);
    };
  }, []);

  // useEffect(() => {
  //   async function picUpdate() {
  //     if (image) {
  //       const data = new FormData();
  //       data.append("file", image);
  //       data.append("upload_preset", "insta-clone");
  //       data.append("cloud_name", "dqbcudtfg");
  //       try {
  //         const request = await fetch(
  //           "https://api.cloudinary.com/v1_1/dqbcudtfg/image/upload",
  //           {
  //             method: "post",
  //             body: data,
  //           }
  //         );
  //         const res = await request.json();
  //         // console.log(res);

  //         // localStorage.setItem(
  //         //   "user",
  //         //   JSON.stringify({ ...state, pic: res.url })
  //         // );
  //         // dispatch({ type: "UPDATEPIC", payload: res.url });
  //         const getPic = await fetch("/updatepic", {
  //           method: "put",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + localStorage.getItem("jwt"),
  //           },
  //           body: JSON.stringify({
  //             pic: res.url,
  //           }),
  //         });
  //         const result = await getPic.json();
  //         console.log(result);
  //         localStorage.setItem(
  //           "user",
  //           JSON.stringify({ ...state, pic: result.pic })
  //         );
  //         dispatch({ type: "UPDATEPIC", payload: res.pic });
  //         window.location.reload();
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  //   picUpdate();
  // }, [image]);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dqbcudtfg");
      fetch("https://api.cloudinary.com/v1_1/dqbcudtfg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              // console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div className="heading">
      <div className="profile-container">
        <div className="container-img">
          <img
            src={state ? state.pic : "loading"}
            className="profile-img"
            alt="profile"
          />

          {/* file upload field coming from materializecss */}
          <div className="file-field input-field profile-edit">
            <div className="btn #42a5f5 blue darken-1">
              <span>Edit Pic</span>
              <input
                type="file"
                // onChange={(e) => setImage(e.target.files[0])}
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          {/* end of file upload field coming from materializecss */}
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <h4>{state ? state.email : "loading"}</h4>
          <div className="profile-tags">
            <h5>{post ? post.length : "loading"} post</h5>
            <h5>{state ? state.followers.length : "0"} followers</h5>
            <h5>{state ? state.following.length : "0"} following</h5>
          </div>
        </div>
      </div>
      <div className="gallary">
        {post.map((pic) => (
          <img key={pic._id} src={pic.photo} className="item" alt={pic.title} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
