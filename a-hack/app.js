
var express = require('express'),
    routes = require('./routes'),

    http = require('http'),
    path = require('path');

var mongoose = require('mongoose');
    
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  server.listen(3000);

// Configuration

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

// Routes

app.get('/home', routes.index);

app.get('/english', routes.english);

app.get('/medical', routes.medical);

io.set('log level',1);
 // var testLocations = Array();
 //      testLocations[0] = {x:43.6617, y:-79.3951};
 //      testLocations[1] = {x:43.6517, y:-79.3951};
 //      testLocations[2] = {x:43.6217, y:-79.3951};
 //      testLocations[3] = {x:43.6617, y:-79.3951};
 //      testLocations[4] = {x:43.6317, y:-79.3951};


var db = mongoose.connect('mongodb://applekey:poppy222@alex.mongohq.com:10041/applekeyTest');

var medical = io.sockets.on('connection', function (socket) {

    socket.on('getMedicalLocations',function(){
      FindMapLocationRecords(function(medicalLocations){
      console.log(medicalLocations);
      medical.emit('medicalLocations', medicalLocations);
      });
    });

    socket.on('getExplaination',function(currentInstitution){
      getExplaination(currentInstitution,function(explainations){
      console.log(explainations);
      socket.emit('explaination',explainations);
      });
    });
  
    socket.on('getLatestQuestions',function(){
      console.log('getting');
      getQuestionsAndAnswers(function(questions){
      console.log(questions);
      socket.emit('updateFaqs',questions);
      });
    });
    ////////////////////////////////////////////////////////
    socket.on('postquestion',function(question){
      console.log('questionposted');
      PostQuestion(question,function(){
        io.sockets.emit('postSuccessful',question);
      });
    });
  }); 

 function PostQuestion(question,callback)
 {
    var questionSchema = new mongoose.Schema({
    Comments:String,
    CommentDate:Date
    });
    var Question = db.model('Questions', questionSchema);
    newQuestion = new Question({
      Comments:question.Comments,
      CommentDate:question.CommentDate
    });
    newQuestion.save();
    callback();
 }

 function UpdateLog()
 {
   //console.log('here');
   io.sockets.emit('updateFaqs',{faq:'updated'});
 }

  //DeleteAllRecords();
  //InsertDummyRecords();

 function DeleteAllRecords()
 {
   var locationSchema = new mongoose.Schema({
     xLocation:Number,
     yLocation:Number
     });

    var completeGoogleMapsLocation = new mongoose.Schema({
     location: [locationSchema],
     rating: Number,
     waitTime: Number,
     comments: Array
     });

  

   var collection = mongoose.model('CompleteGoogleMaps',completeGoogleMapsLocation);
   collection.remove({},function(error){});

 }

 function FindMapLocationRecords(callback)
 {

   var locationSchema = new mongoose.Schema({
     xLocation:Number,
     yLocation:Number
     });

    var completeGoogleMapsLocation = new mongoose.Schema({
     Name: String,
     Address: String,
     location: [locationSchema],
     rating: Number,
     waitTime: Number,
     comments: Array
     });

    var CompleteGoogleMaps = db.model('CompleteGoogleMaps', completeGoogleMapsLocation);


    CompleteGoogleMaps.find(function(err,questions)
      {
        //console.log(questions);  
        callback(questions);
      });

 }

 function InsertDummyRecords()
  {
    var locationSchema = new mongoose.Schema({
     xLocation:Number,
     yLocation:Number
     });

    var completeGoogleMapsLocation = new mongoose.Schema({
     Name: String,
     Address: String,
     location: [locationSchema],
     rating: Number,
     waitTime: Number,
     comments: Array
     });

    var CompleteGoogleMaps = db.model('CompleteGoogleMaps', completeGoogleMapsLocation);
    
    for (var i = testLocations.length - 1; i >= 0; i--) {
      var silence = new CompleteGoogleMaps(
     { 
       Name:'helloworld',
       Address:'123 Sesmie Street',
       rating: 6,
       waitTime: 7,
       comments: ['Array']
     });
     silence.location.push({xLocation:testLocations[i].x,yLocation:testLocations[i].y});
     
     silence.save(function (err, fluffy) {
     }); 
    };
  }

  //insertMockQuestions();
  function insertMockQuestions()
  {
    var questionSchema = new mongoose.Schema({
    Comments:String,
    CommentDate:Date
    });

    var Questions = db.model('Questions', questionSchema);
    
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()
    
    for (var i = 10 ; i >= 0; i--) {
     var myQuestion = new Questions({
        Comments:'Q: this is the question A: This is the answer',
        CommentDate: currentTime,
      });

      myQuestion.save(function(error){
        if(error)
          console.log(error);
        else
          console.log('dummy questions and answers inserted');
      });
    };
  }
  
  function getQuestionsAndAnswers(callback)
  {
    var questionSchema = new mongoose.Schema({
    Comments:String,
    CommentDate:Date
    });

    var question = db.model('Questions', questionSchema);
    var questionsFromDB = question.find().sort('CommentDate').limit(5).exec(function(err,questions)
      {
        //console.log(questions);  
        callback(questions);
      });
    //console.log(questionsFromDB);
  }

  //storeMockExplaination();
  function storeMockExplaination()
  {
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()

    var explainationSchema = new mongoose.Schema({
      organziation:String,
      explanationHtml:String,
      lastTimeUpdated: Date
      });

      var Explaination = db.model('Explaination', explainationSchema);
      var oneExplaination = new Explaination(
      {
        organziation:'Waterloo',
        explanationHtml:'This is to be stored into the database for waterloo',
        lastTimeUpdated:currentTime
      });
      oneExplaination.save();
  }

  function getExplaination(currentInstitution,callback)
  {
     var explainationSchema = new mongoose.Schema({
      explanationHtml:String,
      lastTimeUpdated: Date
      });

     console.log(currentInstitution);

      var Explaination = db.model('Explaination', explainationSchema);
    Explaination.find({organziation:currentInstitution},function(error,results){
      if(error)
        return;
      callback(results);
    })
  }


 

        
     