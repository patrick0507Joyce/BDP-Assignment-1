const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const parseArgs = require('./Tools/parseArgs');
const storeDataset = require('./Tools/storeDataset');
//Import env
dotenv.config();

//tools for parsing args and store into DB
const [datasetPath, datasetName] = parseArgs();
storeDataset(datasetPath, datasetName);

//Import Routes
const roomRoute = require('./Routes/roomsRoute');
const reviewRoute = require('./Routes/reviewsRoute');

//connect to DB
const dbConfig = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(process.env.DB_CONNECT, dbConfig, () => {
  console.log("connected to DB cluster");
});

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
