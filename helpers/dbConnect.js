const mongoose = require("mongoose");

async function Connect() {
  await mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log(err));
}

module.exports = { Connect }