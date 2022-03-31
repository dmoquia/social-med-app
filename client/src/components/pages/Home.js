import React, { useState, useEffect } from "react";
import SinglePostCard from "../SinglePostCard";

const Home = () => {
  const [feeds, setFeed] = useState([]);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setFeed(result);
      });
    return () => {
      setFeed([]);
      console.log("unmonted");
    };
  }, []);
  // const likePost = async (id) => {
  //   try {
  //     const likes = await fetch("/like", {
  //       method: "put",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("jwt"),
  //       },
  //       body: JSON.stringify({
  //         postId: id,
  //       }),
  //     });
  //     const result = await likes.json();
  //     const newData = feeds?.map((item) => {
  //       if (item._id === result._id) {
  //         return result;
  //       } else {
  //         return item;
  //       }
  //     });
  //     setFeed(newData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        // this code will update the current state to new state
        const newData = feeds.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setFeed(newData);
        // end of this code will update the current state to new state
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        // this code will update the current state to new state
        const newData = feeds?.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setFeed(newData);
        // end of this code will update the current state to new state
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        // this code will update the current state to new state
        const newData = feeds?.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setFeed(newData);

        // end of this code will update the current state to new state
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletepost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = feeds.filter((feed) => {
          return feed._id !== result._id;
        });
        setFeed(newData);
      });
  };
  const deleteComment = (id, commentId) => {
    fetch(`/comment/${id}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      // body: JSON.stringify({
      //   postId: id,
      //   commentId,
      // }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = feeds.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setFeed(newData);
      });
  };
  return (
    <>
      {feeds.map((feed) => {
        return (
          <SinglePostCard
            key={feed._id}
            feed={feed}
            likePost={likePost}
            unlikePost={unlikePost}
            makeComment={makeComment}
            deletepost={deletepost}
            deleteComment={deleteComment}
          />
        );
      })}
    </>
  );
};

export default Home;
