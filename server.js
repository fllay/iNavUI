const express=require('express')
const bodyParser=require('body-parser')
const app =express()
const router = express.Router();

const path = require('path')
var fs = require('fs');
var staticRoot = __dirname + '/dist/inav-ui/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function(req,res,next){
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
res.setHeader('Access-Control-Allow-Headers','content-type,x-access-token');
res.setHeader('Access-Control-Allow-Credentials',true);
next();
});

app.use(function(req, res, next) {
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        return next();
    }
    var ext = path.extname(req.path);
    if (ext !== '') {
        return next();
    }
    fs.createReadStream(staticRoot + 'index.html').pipe(res);
});

app.use(express.static(staticRoot));

app.get('/home',(req,res)=>{
    res.end("Well come to home");
})

app.listen(3000,()=>{
  console.log('server is running on http://localhost:3000');  
  console.log('server is running on http://localhost:3000');  
})