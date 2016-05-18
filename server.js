// roomedit3d/server.js

var pkg = require( './package.json' );
var lmvConfig = require('./config/config-view-and-data');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Lmv = require('view-and-data');
var express = require('express');
var tokenapi = require('./routes/api/token');
var roomedit3dapi = require('./routes/api/roomedit3d');

var app = express();

app.use('/', express.static(__dirname + '/www/'));
app.use(favicon(__dirname + '/www/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var lmv = new Lmv(lmvConfig);

// async init of our token API

lmv.initialize().then(
  function() {
    app.use('/api/token',tokenapi(lmv));
  }, function(error) {
    console.log(error);
  }
);

app.use('/api/roomedit3d', roomedit3dapi());

app.set('port', process.env.PORT || 3000);

var server = app.listen(
  app.get( 'port' ),
  function() {
    var a = server.address().port;
    console.log(
      'Roomedit3d server ' + pkg.version
      + ' listening at port ' + a + '.'
    );
  }
);

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('roomedit3d', { hello: 'world' });
});
