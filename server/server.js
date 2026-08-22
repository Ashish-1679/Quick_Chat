const express = require('express');
require("dotenv/config");
const cors = require('cors');
const app = express();
const http = require('http');
app.use(cors());
const server = http.createServer(app);
app.use(express.json({limit: '4mb'}));
app.use(cors());
app.use('/api/status',(req,res)=>{
    res.send( "Server is Live");
});
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
