// import * as express from "express";
// import * as bodyParser from "body-parser";
// import * as fs from "fs";
// import * as https from "https";
// import * as http from "http";

// const dist = './dist';

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(dist));


// app.get('*', (req, res) => {
//     res.sendFile(`index.html`, { root: dist });
// });

// var server = http.createServer(app);

// let serverPort = process.env.port || process.env.PORT || 3980

// server.listen(serverPort, () => {
//     console.log(`server is listening on ${serverPort}`);
// });
