const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080
const Routes = require("./routes")
const jwt_decode = require('jwt-decode')

//middelware
app.use("/", async (req, res, next) => {
  try {


    if (req.headers.authorization) {
      let token = req.headers.authorization;
      let userObj = jwt_decode(token);
      if (userObj.iss) {
        next();
      } else {
        return res.status(400).json({
          status: "failed",
          message: "User Not Authorized"
        })
      }
    } else {
      return res.status(400).json({
        status: "failed",
        message: "User Not Authorized"
      })
    }
  } catch (e) {
    return res.status(400).json({
      status: "failed",
      message: "User Not Authorized"
    })
  }


});






app.use("/", Routes);


app.listen(PORT, () => console.log("server is up at 8080"));