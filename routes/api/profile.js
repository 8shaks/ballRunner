const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const validateProfileInput = require("../../validation/profile");
const Profile = require('../../models/Profile');


// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res.status(400).json({errors: { profile: 'There is no profile for this user' }});
    }
    // only populate from user document if profile exists
    res.json(profile.populate('user'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',auth,
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { skillLevel, phone} = req.body;
    const profileFields = {
      user: req.user.id,
      skillLevel,
      phone
    };
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// // @route    DELETE api/profile
// // @desc     Delete profile, user & posts
// // @access   Private
// router.delete('/', auth, async (req, res) => {
//   try {
//     // Remove user posts
//     await Post.deleteMany({ user: req.user.id });
//     // Remove profile
//     await Profile.findOneAndRemove({ user: req.user.id });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.user.id });

//     res.json({ msg: 'User deleted' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });



module.exports = router;