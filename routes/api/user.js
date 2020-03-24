
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const { check } = require('express-validator');
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");


const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      console.log(errors)
      return res.status(400).json({errors:errors});
    }
    const { username, email, password, password2 } = req.body;

    try {
      let userEmail = await User.findOne({ email });
      
      if (userEmail) {
        console.log('yo')
        return res
          .status(400)
          .json({ errors: { email: 'Email already exists' } });
      }
      let userName = await User.findOne({ username });
      if (userName) {
        console.log('yo')
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