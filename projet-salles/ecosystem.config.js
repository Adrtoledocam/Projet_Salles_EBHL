module.exports = {
  apps: [
    {
      name: "occupation-de-sallse",
      script: "./index.js",
      instances: "5",
      env: {
        PORT: 80,
      },
    },
  ],
};
