import mongoose = require('mongoose');

export default {
  init() {
    const dbOptions: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };

    mongoose.connect(
      `mongodb+srv://admin:511510318eden@taskmgrcluster.cf4j5.mongodb.net/TaskmgrCluster?retryWrites=true&w=majority`,
      dbOptions
    );
    mongoose.set(`useFindAndModify`, false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on(`connected`, () => {
      console.log(`Mongoose has successfully connected.`);
    });

    mongoose.connection.on(`error`, (err) => {
      console.error(`Mongoose connection error:\n${err.stack}`);
    });

    mongoose.connection.on(`disconnected`, () => {
      console.warn(`Mongoose connection lost.`);
    });
  },
};
