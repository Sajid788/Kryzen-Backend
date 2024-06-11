const express = require("express");
const { connection, PORT } = require("./config/db");
const { userRouter } = require("./routes/user_routes");
const cors = require("cors");
const { productRouter } = require("./routes/product_routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server is running!"});
});

app.use("/user", userRouter);
app.use("/product", productRouter);


app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(`${error} is giving while connecting`);
  }
  console.log(`Listening on PORT: ${PORT}`);
});