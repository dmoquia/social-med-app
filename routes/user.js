const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("post");
const User = mongoose.model("user");

// router.get("/user/:id", requireLogin, async (req, res) => {
//   try {
//     const user = User.findOne({ _id: req.params.id }, async () => {
//       await User.find({ postedBy: req.params.id });
//     })
//       .select("-password")
//       .populate("postedBy", "_id name")
//       .exec((err, post) => {
//         if (err) {
//           return res.status(422).json({ error: err });
//         }
//         res.json({ user, post });
//       });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: "server error" });
//   }
// });
router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "user not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  // will increase followers
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      //will increase following
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  // will reduce followers
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      // will reduce following
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic not posted" });
      }
      res.json(result);
    }
  );
});

// router.post("/search-users", (req, res) => {
//   let userPattern = new RegExp("^" + req.body.query);
//   User.find({ email: { $regex: userPattern } })
//     .then((user) => {
//       res.json({ user });

//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
router.post("/search-users", async (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  try {
    const user = await User.find({ email: { $regex: userPattern } }).select(
      "_id email"
    );
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
