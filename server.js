const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Implementasi rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100 // batasi setiap IP hingga 100 permintaan per jendela
});

app.use(limiter);

// Middleware untuk error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

// Middleware for input validation
const validateAnimeId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID anime tidak valid' });
  }
  next();
};

// Route untuk mendapatkan daftar anime populer
app.get('/anime/popular', async (req, res) => {
  try {
    const response = await axios({
      url: 'https://graphql.anilist.co',
      method: 'post',
      data: {
        query: `
          query {
            Page(page: 1, perPage: 10) {
              media(type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                description
                coverImage {
                  large
                }
              }
            }
          }
        `
      }
    });
    res.json(response.data.data.Page.media);
  } catch (error) {
    res.status(500).send('Error fetching data from Anilist API');
  }
});

// Updated route for anime details with caching and input validation
app.get('/anime/:id', validateAnimeId, async (req, res) => {
  const animeId = req.params.id;
  const cacheKey = `anime_${animeId}`;

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios({
      url: 'https://graphql.anilist.co',
      method: 'post',
      data: {
        query: `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
              description
              episodes
              duration
              genres
              averageScore
              coverImage {
                large
              }
            }
          }
        `,
        variables: {
          id: parseInt(req.params.id)
        }
      }
    });

    const animeData = response.data.data.Media;
    // Store in cache
    cache.set(cacheKey, animeData);

    res.json(animeData);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Anime tidak ditemukan' });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil detail anime dari API Anilist' });
    }
  }
});

// New route for anime search
app.get('/anime/search/:query', async (req, res, next) => {
  try {
    const response = await axios({
      url: 'https://graphql.anilist.co',
      method: 'post',
      data: {
        query: `
          query ($search: String) {
            Page(page: 1, perPage: 10) {
              media(search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  medium
                }
              }
            }
          }
        `,
        variables: {
          search: req.params.query
        }
      }
    });
    res.json(response.data.data.Page.media);
  } catch (error) {
    next(error); // Gunakan middleware error handling
  }
});

// Basic API documentation route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Anime API',
    endpoints: {
      '/anime/popular': 'Get popular anime',
      '/anime/:id': 'Get anime details by ID',
      '/anime/search/:query': 'Search anime by title'
    }
  });
});

// Mulai server API
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
