module.exports = {
  apps: [{
    name: "pna-webserver",
    script: "./build/server.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
  }]
}