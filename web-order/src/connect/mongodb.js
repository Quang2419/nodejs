const mongoose = require('mongoose')

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/admin?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1",
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) {
            console.log(err)
        }
        else {console.log("connect to MongoDB")}
    }
)

exports.mongoose