const http = require("http");
const app=require("./app");


const port = process.env.PORT || 9000;

const server = http.createServer(app);

server.listen(port,()=>{
    console.log("server Created att 9000");
});