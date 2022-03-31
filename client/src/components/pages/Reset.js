import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");

  const PostData = async () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#ef5350 red lighten-1" });
      return;
    }

    try {
      const res = await fetch("/reset-password", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();

      if (data.error) {
        M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
      } else {
        M.toast({
          html: data.message,
          classes: "#66bb6a green lighten-1",
        });
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
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #42a5f5 blue lighten-1"
          onClick={() => PostData()}
        >
          rese password
        </button>
      </div>
    </div>
  );
};

export default Reset;
