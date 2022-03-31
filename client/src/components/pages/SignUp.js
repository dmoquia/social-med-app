import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
const defPic =
  "https://res.cloudinary.com/dqbcudtfg/image/upload/v1648023639/default-pic_jxasx5.png";
const SignUp = () => {
  const history = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = async () => {
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
      // console.log(res);
      setUrl(res.url);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFields = async () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#ef5350 red lighten-1" });
      return;
    }

    try {
      const res = await fetch("/signup", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: url,
        }),
      });
      const data = await res.json();
      // console.log(data);
      if (data.error) {
        M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
      } else {
        M.toast({ html: data.msg, classes: "#66bb6a green lighten-1" });

        history("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>mamoy meal</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* file upload field coming from materializecss */}
        <div className="file-field input-field">
          <div className="btn #42a5f5 blue darken-1">
            <span>Upload Pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        {/* end of file upload field coming from materializecss */}
        <button
          className="btn waves-effect waves-light #42a5f5 blue lighten-1 "
          onClick={() => PostData()}
        >
          signup
        </button>
        <h5>
          <Link to="/signin">already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default SignUp;
