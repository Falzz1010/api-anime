
# Anime Streaming API

This is a simple Anime Streaming API built with Node.js and Express, utilizing the Anilist API to fetch information about popular anime titles.

## Features

- Fetch a list of popular anime.
- Built using Express.js and Axios.
- Fetches data from [Anilist GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs/).
  
## Requirements

To run this API, you need to have the following installed:

- [Node.js](https://nodejs.org/en/) (v14+)
- [npm](https://www.npmjs.com/) (v6+)

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/anime-streaming-api.git
   cd anime-streaming-api
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

   The server will run on `http://localhost:3000`.

## Usage

Once the server is running, you can use tools like Postman or your browser to test the API.

### Example: Fetch Popular Anime

- **URL:** `http://localhost:3000/anime/popular`
- **Method:** `GET`
  
This endpoint will return a list of popular anime fetched from the Anilist API.

Example response:

```json
[
  {
    "id": 1,
    "title": {
      "romaji": "Naruto",
      "english": "Naruto",
      "native": "ナルト"
    },
    "description": "A young ninja who seeks recognition from his peers...",
    "coverImage": {
      "large": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-Naruto.jpg"
    }
  },
  {
    "id": 2,
    "title": {
      "romaji": "One Piece",
      "english": "One Piece",
      "native": "ワンピース"
    },
    "description": "Follows the adventures of Monkey D. Luffy...",
    "coverImage": {
      "large": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-OnePiece.jpg"
    }
  }
]
```

## Running the API in the Background

To keep the API running even after closing the terminal, you can use [PM2](https://pm2.keymetrics.io/), a process manager for Node.js applications.

### Install PM2

```bash
npm install pm2 -g
```

### Start the API with PM2

```bash
pm2 start server.js
```

## Deploying the API

You can deploy this API to any cloud platform that supports Node.js, such as Heroku or DigitalOcean. Here's a simple guide to deploying on Heroku:

1. **Login to Heroku**:

   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:

   ```bash
   heroku create
   ```

3. **Push your code to Heroku**:

   ```bash
   git push heroku master
   ```

4. **Access your deployed API**:

   Your API will be available at a URL like:

   ```
   https://your-app-name.herokuapp.com/anime/popular
   ```

## Contributing

If you'd like to contribute to this project, feel free to submit a pull request or open an issue. Please make sure to follow the contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
