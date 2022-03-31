import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import Loader from "./Loader";

const CreatePost = () => {
  const history = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Created post Successfully",
              classes: "#43a047 green darken-1",
            });
            history("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dqbcudtfg");
    try {
      const request = await fetch(
        "https://api.cloudinary.com/v1_1/dqbcudtfg/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const res = await request.json();
      setUrl(res.url);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="card input-field card-upload">
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {/* file upload field coming from materializecss */}
      <div className="file-field input-field">
        <div className="btn #42a5f5 blue darken-1">
          <span>File</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      {/* end of file upload field coming from materializecss */}
      <button
        className="btn waves-effect waves-light #42a5f5 blue darken-1"
        onClick={() => postDetails()}
      >
        submit
      </button>
    </div>
  );
};

export default CreatePost;
