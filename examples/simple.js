var microcule = require("microcule");
var express = require("express");
var micromix = require("../index.js");

var app = micromix(express, microcule.plugins)({
  "/test": [{
    "plugin": "spawn",
    "config": {
      "code": "module.exports = function (hook) { hook.res.end('test'); };",
      "language": "javascript"
    }
  }],
  "/gist": [{
    "plugin": "sourceGithubGist",
    "config": {
      "token": "1234",
      "main": "echoHttpRequest.js",
      "gistID": "357645b8a17daeb17458"
    }
  }, {
    "plugin": "bodyParser"
  }, {
    "plugin": "spawn",
    "config": {
      "language": "javascript"
    }
  }],
  "/repo": [{
    "plugin": "sourceGithubRepo",
    "config": {
      "token": "1234",
      "repo": "Stackvana/microservice-examples",
      "branch": "master",
      "main": "javascript/index.js",
    }
  }, {
    "plugin": "bodyParser"
  }, {
    "plugin": "spawn",
    "config": {
      "language": "javascript"
    }
  }]
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});