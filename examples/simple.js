var micromix = require("../index.js");
var express = require("express");
var microcule = require("microcule");
var plugins = microcule.plugins;

var app = micromix(express, plugins)({
  "/function": [
    {
      "method": "get",
      "uses": [{
        "plugin": "spawn",
        "config": {
          "code": function (hook) { hook.res.end('get'); },
          "language": "javascript"
        }
      }]
    },
    {
      "method": "post",
      "uses": {
        "plugin": "spawn",
        "config": {
          "code": function (hook) { hook.res.end('post'); },
          "language": "javascript"
        }
      }
    }
  ],
  "/string": {
    "plugin": "spawn",
    "config": {
      "code": "module.exports = function (hook) { hook.res.end('test'); };",
      "language": "javascript"
    }
  },
  "/gist": {
    "method": "get",
    "uses": [
      {
        "plugin": "sourceGithubGist",
        "config": {
          "token": "1234",
          "main": "echoHttpRequest.js",
          "gistID": "357645b8a17daeb17458"
        }
      },
      "bodyParser",
      {
        "plugin": "spawn",
        "config": {
          "language": "javascript"
        }
      }
    ]
  },
  "/repo": [
    {
      "plugin": "sourceGithubRepo",
      "config": {
        "token": "1234",
        "repo": "Stackvana/microservice-examples",
        "branch": "master",
        "main": "javascript/index.js",
      }
    },
    "bodyParser",
    {
      "plugin": "spawn",
      "config": {
        "language": "javascript"
      }
    }
  ]
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});