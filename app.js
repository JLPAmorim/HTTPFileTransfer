var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');

var mongoose = require('mongoose');

mongoose.connect('mongodb://db_file:27017/files', 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Verifica se o pedido veio com o token de acesso
app.use(function(req, res, next){
  var myToken = req.query.token || req.body.token
  if(myToken){
    jwt.verify(myToken, "VR2021", function(e, payload){
      if(e){
        res.status(401).jsonp({error: e})
      }else{
        next()
      }
    })
  }else{
    res.status(401).jsonp({error: "Token Inexistente!"})
  }
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).jsonp({error: err.message})
});

module.exports = app;
