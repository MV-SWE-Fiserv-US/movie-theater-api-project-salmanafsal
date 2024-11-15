const {User, Show} = require('../models/index.js')
const express = require('express');
const router = express.Router();
router.use(express.json());

const { check, validationResult } = require("express-validator");


/*router.post('/',
[
    check("username").trim().notEmpty().withMessage('UserName is required and cannot be empty or whitespace'),
    check('password').trim().notEmpty().withMessage('Password is required and cannot be empty or whitespace')
],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return errors if validation fails
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const newUser = await User.create({ username, password });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Unable to create restaurant', details: error.message });
    }
  }
);*/

  router.get('/', async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch restaurants', details: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const newuser = await User.findByPk(req.params.id);
      if (!newuser) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(newuser);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch User', details: error.message });
    }
  });


  router.get('/shows/:id', async (req, res) => {
    try {
      const newuser = await User.findByPk(req.params.id, {

        include: {

            model: Show,
            through: { attributes: [] }
        }


      });
      if (!newuser) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(newuser.shows);
      console.log(newuser.shows)
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch user', details: error.message });
    }
  });



  router.put('/userid/:uid/shows/:sid', async (req, res) => {
    const { uid, sid } = req.params;

    try {
        // Find the user and the show
        const user = await User.findByPk(uid);
        const show = await Show.findByPk(sid);

        if (!user || !show) {
            return res.status(404).json({ message: 'User or Show not found' });
        }

        // Associate the user with the show
        await user.addShow(show); // Sequelize's addShow() method adds the association

        res.status(200).json({ message: 'Show added to user\'s watched list' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
  module.exports = router;
