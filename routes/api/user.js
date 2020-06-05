
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");


const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', async (req, res) => {
  console.log("Hello")
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      console.log(errors)
      return res.status(400).json({errors:errors});
    }
    const { username, email, password } = req.body;

    try {
      let userEmail = await User.findOne({ email });
      
      if (userEmail) {
        return res
          .status(400)
          .json({ errors: { email: 'Email already exists' } });
      }
      let userName = await User.findOne({ username });
      if (userName) {
        return res
          .status(400)
          .json({ errors: { username: 'Username already exists' }});
      }

      user = new User({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;