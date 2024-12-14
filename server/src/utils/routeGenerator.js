const express = require('express');

function generateCrudRoutes(modelName, model) {
  const router = express.Router();

  // CREATE
  router.post('/', async (req, res) => {
    try {
      const result = await model.create({
        data: req.body
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // READ (all)
  router.get('/', async (req, res) => {
    try {
      const results = await model.findMany();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // READ (one)
  router.get('/:id', async (req, res) => {
    try {
      const result = await model.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // UPDATE
  router.put('/:id', async (req, res) => {
    try {
      const result = await model.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE
  router.delete('/:id', async (req, res) => {
    try {
      await model.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = { generateCrudRoutes };