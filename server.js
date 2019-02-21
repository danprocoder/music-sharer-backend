import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import trackRoutes from './routes/track.js';

const app = express();

// Middleware to handle CORS and preflight requests.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middlewares to parse json and url encoded request body.
app.use(
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(userRoutes);
app.use(trackRoutes);

app.post('/get/key', (req, res) => {
  res.status(200).json({
    status: 200,
    tonart_result: {
      key: 'Gb:min',
    }
  })
});

const port  = process.env.PORT || 3103;
app.listen(port , () => {
  console.log(`Server started on port ${port}`);
});
