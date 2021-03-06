const express = require("express");
const app = express();
const dotenv = require("dotenv");

//Import env
dotenv.config();

//Import Routes
const roomRoute = require('./Routes/roomsRoute');
const reviewRoute = require('./Routes/reviewsRoute');

//middleware
app.use(express.json());

//Route Middlewares
app.use('/rooms', roomRoute);
app.use('/reviews', reviewRoute);

app.get('/', (request, response) => {
  response.send("connected!");
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
