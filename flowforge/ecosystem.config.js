{
  "apps": [
    {
      "name": "flowforge",
      "script": "server/index.js",
      "cwd": "/var/www/automation.beta.nex.monster/html",
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "500M",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3847
      }
    }
  ]
}
