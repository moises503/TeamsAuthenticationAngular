const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');

const dist = './dist';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(dist));

console.log(`serving ${dist}`);

// This is used to prevent your tabs from being embedded in other systems than Microsoft Teams
app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "frame-ancestors teams.microsoft.com *.teams.microsoft.com *.skype.com");
    res.setHeader("X-Frame-Options", "ALLOW-FROM https://teams.microsoft.com/."); // IE11
    return next();
});

// All reques will serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: dist });
});

var server = http.createServer(app);

let serverPort = process.env.port || process.env.PORT || 3978

server.listen(serverPort, () => {
    console.log(`server is listening on ${serverPort}`);
});
