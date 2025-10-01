module.exports = {
  apps: [
    {
      name: "occupation-de-salles",
      script: "./index.js",
      instances: "5",
      exec_mode: "cluster",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
    },
  ],
};
