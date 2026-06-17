const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_URL = 'http://api:3000/books';

// Liste des livres
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    console.log('BOOKS DATA:', JSON.stringify(response.data[0]));
    res.render('index', { books: response.data });
  } catch (err) {
    res.render('index', { books: [] });
  }
});

// Formulaire ajout
router.get('/add', (req, res) => {
  res.render('add');
});

// Soumettre ajout
router.post('/add', async (req, res) => {
  try {
    await axios.post(API_URL, req.body);
    res.redirect('/');
  } catch (err) {
  console.log('CREATE ERROR');
  console.log(err.response?.data);
  console.log(err.response?.status);
  console.log(err.message);

  res.send('Erreur lors de la création');
}
});

// Formulaire modification
router.get('/edit/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/${req.params.id}`);
    res.render('edit', { book: response.data });
  } catch (err) {
    console.log(err.message);
    res.redirect('/');
  }
});

// Soumettre modification
router.post('/edit/:id', async (req, res) => {
  try {
    await axios.put(`${API_URL}/${req.params.id}`, req.body);
    res.redirect('/');
  } catch (err) {
    console.log(err.message);
    res.send('Erreur lors de la modification');
  }
});

// Supprimer
router.get('/delete/:id', async (req, res) => {
  try {
    await axios.delete(`${API_URL}/${req.params.id}`);
    res.redirect('/');
  } catch (err) {
    console.log('DELETE ERROR');
    console.log(err.response?.data);
    console.log(err.response?.status);
    console.log(err.message);

    res.send('Erreur lors de la suppression');
  }
});

module.exports = router;