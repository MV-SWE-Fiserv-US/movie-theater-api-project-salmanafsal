/*GET all shows
GET one show
GET all users who watched a show
PUT update the available property of a show
DELETE a show
GET shows of a particular genre (genre in req.query)*/
const {User, Show} = require('../models/index.js')
const express = require('express');
const routershows = express.Router();
routershows.use(express.json());

const { check, validationResult } = require("express-validator");

routershows.post('/',
[
    check("title").trim().isLength({ max: 25 }).withMessage('It should be within 25 characters')
    
],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return errors if validation fails
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { title, genre, rating, available } = req.body;
      const newShow = await Show.create({ title, genre, rating, available });
      res.status(201).json(newShow);
    } catch (error) {
      res.status(400).json({ error: 'Unable to create Show', details: error.message });
    }
  }
);



routershows.get('/', async (req, res) => {
    try {
      const shows = await Show.findAll();
      res.status(200).json(shows);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch shows', details: error.message });
    }
  });

  routershows.get('/genre', async (req, res) => {
    /*return res.status(400).json({ message: 'Genre is not present' });*/
    console.log(req.query);
    console.log("req.query:", req.query); // Should log an object like { genre: 'comedy' }
     
    const { genre } = req.query; // Get the genre from the query parameter
    console.log("genre:", genre); 
    console.log({genre})
    if (!req.query || Object.keys(req.query).length === 0) {
        return res.status(400).json({ error: 'Query parameters are missing' });
    }
    try {
        if (!genre) {
            return res.status(400).json({ "value": req.query });
        }

        // Fetch shows with the specified genre
        const shows = await Show.findAll({
            where: { genre: genre }, // Filter by genre
        });


        res.status(200).json(shows);
    } catch (error) {
        console.error(error);
        res.json(req.query);
        res.status(500).json({ message: 'Issue with displaying show' });
        
    }
});



  routershows.get('/:id', async (req, res) => {
    try {
      const newshow = await Show.findByPk(req.params.id);
      if (!newshow) return res.status(404).json({ error: 'Show not found' });
      res.status(200).json(newshow);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch Show', details: error.message });
    }
  });

  routershows.get('/:id/users', async (req, res) => {
    /*console.log(req.params);*/
    try {
      const newshow = await Show.findByPk(req.params.id, {

        include: {

            model: User,
            through: { attributes: [] }
        }


      });
      if (!newshow) return res.status(404).json({ error: 'Show not found' });
      res.status(200).json(newshow.users);
      
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch user', details: error.message });
    }
  });
  

  routershows.put('/:id/available', async (req, res) => {
    try {
      const {id} = req.params;  
      const { available } = req.body;
      const [updated] = await Show.update(
        { available },
        { where: { id: req.params.id } }
      );
      if (!updated) return res.status(404).json({ error: 'Show not found' });
      const updatedShow = await Show.findByPk(req.params.id);
      res.status(200).json(updatedShow);
    } catch (error) {
      res.status(400).json({ error: 'Unable to update Show', details: error.message });
    }
  });

  routershows.delete('/:id', async (req, res) => {
    try {
      const deleted = await Show.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Show not found' });
      res.status(204).send(); // Successful deletion, no content
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete Show', details: error.message });
    }
  });

  


module.exports = routershows;