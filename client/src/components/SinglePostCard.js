import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
const SinglePostCard = (props) => {
  const { state } = useContext(UserContext);
  const { title, body, photo, postedBy, likes, _id, comments } = props.feed;

  // this will clear field after enter  comment
  // const cleaField = () => {
  //   document.getElementById("comment-field").reset();
  // };
  // end of this will clear field after enter  comment
  // console.log({ state, props });
  // debugger;
  return (
    <div className="home">
      <div className="card home-card">
        <div className="card-profile-icon-top">
          <h5>
            <Link
              to={
                postedBy._id !== state._id
                  ? `/profile/${postedBy._id}`
                  : "/profile"
              }
            >
              <img
                src={state._id !== postedBy._id ? postedBy.pic : state.pic}
                alt="profile pic"
              />
              {postedBy.name}
            </Link>

            {postedBy._id === state._id && (
              <span>
                <i
                  className="material-icons button-post"
                  onClick={() => props.deletepost(_id)}
                >
                  delete
                </i>
              </span>
            )}
          </h5>
        </div>
        <div className="card-image">
          <img src={photo} alt={title} />
        </div>

        <div className="card-content">
          <i className="material-icons" style={{ color: "red" }}>
            favorite
          </i>
          {likes.includes(state._id) ? (
            <i
              className="material-icons"
              onClick={() => {
                props.unlikePost(_id);
              }}
              style={{ marginLeft: "5px", cursor: "pointer" }}
            >
              thumb_down
            </i>
          ) : (
            <i
              className="material-icons"
              onClick={() => {
                props.likePost(_id);
              }}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            >
              thumb_up
            </i>
          )}

          <h6>{likes.length} Likes</h6>
          <p>{body}</p>
          {comments.map((comment) => {
            return (
              <div className="card-profile-icon" key={comment._id}>
                <h6>
                  <img
                    src={
                      state._id !== comment.postedBy._id
                        ? comment.postedBy.pic
                        : state.pic
                    }
                    alt="profile"
                  />
                  <strong>{comment.postedBy.name} </strong>
                  {comment.text}
                  <span>
                    {comment.postedBy._id === state._id && (
                      <i
                        className="material-icons button-comment "
                        onClick={() => props.deleteComment(_id, comment._id)}
                      >
                        delete
                      </i>
                    )}
                  </span>
                </h6>
              </div>
            );
          })}
          <form
            id="comment-field"
            onSubmit={(e) => {
              e.preventDefault();
              // console.log(e.target[0].value);
              props.makeComment(e.target[0].value, _id);
              e.target.reset(); // <-- alternative to clear field
              // cleaField();
            }}
          >
            <input type="text" placeholder="add a content" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SinglePostCard;
