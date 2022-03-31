const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("post");

router.get("/allpost", requireLogin, async (req, res) => {
  try {
    const post = await Post.find()
      .populate("postedBy", "_id name pic") // this is the code that display user on top
      .populate("comments.postedBy", "_id name pic") //added here so user will be displayed on all post
      .sort("-createdAt");
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});
router.get("/subpost", requireLogin, async (req, res) => {
  try {
    const post = await Post.find(
      // if postedBy in following
      { postedBy: { $in: req.user.following } }
    )
      .populate("postedBy", "_id name pic") // this is the code that display user on top
      .populate("comments.postedBy", "_id name pic") //added here so user will be displayed on all post
      .sort("-createdAt");
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;

  if (!title || !body || !pic) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  req.user.password = undefined;
  // const post = new Post({ title, body, photo: pic, postedBy: req.user });
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
});

router.get("/mypost", requireLogin, async (req, res) => {
  try {
    const post = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});

// this code will add like to a post
router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name") // this code added here so the user wont disapper when the user click on like button
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
// end of this code will add like to a post

// this code will unlike a post
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name") // this code added here so the user wont disapper when the user click on unlike button
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
// end of this code will unlike a post

// comment on a post
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
// end comment on a post

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            // res.json({ message: "successfully deleted" });
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "server error" });
          });
      }
    });
});
// delete comments

router.delete(`/comment/:postId/:comment_id`, requireLogin, (req, res) => {
  // try {
  //   const post = await Post.findByIdAndUpdate(
  //     req.params.postId,
  //     {
  //       $pull: { comments: { _id: req.params.comment_id } },
  //     },
  //     { new: true }
  //   );

  //   if (!post) {
  //     return res.status(400).send("Post not found");
  //   }
  //   res.json(post);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send("Something went wrong");
  // }
  // console.log(req.params);

  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: { _id: req.params.comment_id } },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err || !result) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
// end of delete comments
module.exports = router;
