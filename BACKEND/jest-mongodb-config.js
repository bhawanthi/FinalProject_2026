module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '7.0.0',
      skipMD5: true
    },
    instance: {
      dbName: 'finance-tracker-test'
    },
    autoStart: false
  }
};
