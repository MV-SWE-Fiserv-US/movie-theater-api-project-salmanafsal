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

routershows.get('/', async (req, res) => {
    try {
      const shows = await Show.findAll();
      res.status(200).json(shows);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch shows', details: error.message });
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

  routershows.get('/shows/:id', async (req, res) => {
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

  routershows.get('/genrebasedshows', async (req, res) => {
    console.log(req.query);
    const { genre } = req.query; // Get the genre from the query parameter
    console.log({genre})
    try {
        if (!genre) {
            return res.status(400).json({ message: 'Genre is not present' });
        }

        // Fetch shows with the specified genre
        const shows = await Show.findAll({
            where: { genre }, // Filter by genre
        });


        res.status(200).json(shows);
    } catch (error) {
        console.error(error);
        res.json(req.query);
        res.status(500).json({ message: 'Issue with displaying show' });
        
    }
});


module.exports = routershows;