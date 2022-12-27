require("dotenv").config();
const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/pos-system", {
//   useNewUrlParser: true,
//   //useCreateIndex: true,
// });

// mongoose
//   .connect(process.env.DBConnection, {
//     maxPoolSize: 50,
//     wtimeoutMS: 2500,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     //useFindAndModify: false,
//   })
//   .then(console.log("Database connected!"))
//   .catch((err) => console.log(`error >>: ${err}`));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBConnection, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();
//module.exports = connectDB;
