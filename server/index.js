import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// routes files
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";


// data import  directly
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from "./data/index.js";



// configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
// it allows make api call on different ports
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
// space in url
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());


// Routes
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);


// Mongoose setup
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    // only listen if mongodb is connected
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // only add one time directly to mongodb 
    // User.insertMany(dataUser);
    // Product.insertMany(dataProduct);
    // Product.insertMany(dataProductStat); // this not working or take time bcoz too heavy may be
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
 
}).catch(( error ) => console.log(`Server did not coonect ${error}`))

// direct way of inserting data to mongodb only once
// const PORT = process.env.PORT || 9000;
// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     // Use Promise.all to run data insertion operations in parallel
//     return Promise.all([
//       User.insertMany(dataUser),
//       Product.insertMany(dataProduct),
//       ProductStat.insertMany(dataProductStat),
//     ]);
//   })
//   .then(() => {
//     // Start the server after all data insertion operations are complete
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
//   })
//   .catch((error) => console.log(`Server did not connect ${error}`));
 
 
  
  
  
  