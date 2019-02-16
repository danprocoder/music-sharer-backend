import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import trackRoutes from './routes/track.js';

const app = express();

app.use(
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(userRoutes);
app.use(trackRoutes);

const port  = process.env.PORT || 3103;
app.listen(port , () => {
  console.log(`Server started on port ${port}`);
});
