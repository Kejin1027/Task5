let morgan = require("morgan");
// 1. get a reference to mongoDB module ref
let mongodb = require("mongodb");
// 2. from ref get the client
let MongoClient = mongodb.MongoClient;
let bodyParser = require("body-parser");
let db = null;
let col = null;
// 3. from the client get the database
let express = require("express");
let app = express();
app.use(morgan('common'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static('img'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({extended:false}));
let url = "//mongodb://localhost:27017";  //for mongodb server
MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true},function(err,client){
    db = client.db("week5");
    col = db.collection("table");
    
});

app.get('/',function(req,res){
    res.render('index.html');
});
app.get('/addtask',function(req,res){
    res.render('addtask.html');
});
app.get('/listAll',function(req,res){
    let query = {};
    col.find(query).toArray(function(err,data){
        res.render('listAll.html',{db: data});
    })
});
app.get('/update',function(req,res){
    res.render('update.html');
});
app.get('/delete',function(req,res){
    res.render('delete.html');
});

app.post('/data',function(req,res){
    res.render('addtask.html');
});

app.post('/data2',function(req,res){
    let query = {};
    col.find(query).toArray(function(err,data){
        res.render('listAll.html',{db: data});
    })
});

app.post('/data3',function(req,res){
    res.render('delete.html');
}); 

app.post('/data4',function(req,res){
    res.render('update.html');
    
});

app.post('/addtask',function(req,res){
    let taskDetail = req.body;
    let id = Math.floor(Math.random()*1000);
    let name = taskDetail.taskName;
    let assign = taskDetail.assignTo;
    let date =taskDetail.dueDate;
    let status = taskDetail.taskStatus;
    let des = taskDetail.taskDescription;
    console.log(taskDetail);
    col.insertOne({
        ID: id,
        taskName: name,
        assignTo: assign,
        dueDate: date,
        taskStatus: status,
        taskDescription: des
    });
    res.redirect('/listAll');
});

app.post('/deleteData',function(req,res){
    let deleteID = parseInt(req.body.id);
    let filter = {ID: deleteID};
    col.deleteOne(filter);
    res.redirect('/listAll');
});

app.post('/deleteAll',function(req,res){
    let filter = {};
    col.deleteMany(filter);
    res.redirect('/listAll');
});

app.post('/updateTask',function(req,res){
    let filter = parseInt(req.body.id);
    let newStatus = req.body.newStatus;
    col.updateOne({ID: filter}, { $set: {taskStatus: newStatus} }, { upsert: true }, function (err, result) {
    });
    res.redirect('/listAll');
});

app.listen(8080);  // for http server


//sudo apt install -y mangodb