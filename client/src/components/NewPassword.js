// import React, { useState, useContext } from "react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import M from "materialize-css";
// import { UserContext } from "../../App";
const NewPassword = () => {
  //   const { state, dispatch } = useContext(UserContext);
  const history = useNavigate();
  //   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token } = useParams();
  console.log(token);
  const PostData = async () => {
    // if (
    //   !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     email
    //   )
    // ) {
    //   M.toast({ html: "invalid email", classes: "#ef5350 red lighten-1" });
    //   return;
    // }

    try {
      const res = await fetch("/new-password", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          //   email,
          password,
          token,
        }),
      });
      const data = await res.json();

      if (data.error) {
        M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
      } else {
        // localStorage.setItem("jwt", data.token);
        // localStorage.setItem("user", JSON.stringify(data.user));
        // dispatch({ type: "USER", payload: data.user });
        M.toast({
          //   html: "signed in successfully",
          html: data.message,
          classes: "#66bb6a green lighten-1",
        });
        // history("/");
        history("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>mamoy meal</h2>
        {/* <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        /> */}
        <input
          type="password"
          placeholder="enter new password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #42a5f5 blue lighten-1"
          onClick={() => PostData()}
        >
          update new password
        </button>
        {/* <h5>
          <Link to="/signup">dont have an account?</Link>
        </h5> */}
      </div>
    </div>
  );
};

export default NewPassword;
