// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var config = require('./package.json');
var ports = config.port;
var apiPort = ports.api;
var url = config.env.urls[config.env.current] + ":" + apiPort;
var request = require('request');
var session = require('express-session');
var uuidv1 = require('uuid/v1');
var cors = require('cors');

var sess = {
    genid: function () {
        return "xx" + uuidv1(); // use UUIDs for session IDs 
    },
    secret: uuidv1(),
    cookie: {},
    resave: true,
    saveUninitialized: true
} 

if(app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy 
    sess.cookie.secure = true; // serve secure cookies 
}

app.use(session(sess));
app.use(cors());
app.set('etag', false);
app.set('x-powered-by', false);
 

var isEmpty = function (o) {
    return o === null || o === undefined;
}

// configure app
app.use(morgan('dev')); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || apiPort; // set our port





// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    //console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.send('Hello from API!');
});


// on routes defined dynamically.

// each api/x goes through specific x.js file.
var defineCommonRoutes = function (arrays) {
   
    for (var i = 0; i < arrays.length; i++) {
        var item = arrays[i];

        router
            .route(item)
            .post(function (req, res) {
                callfunction(req, res, 'Post');
            })
            .get(function (req, res) {
                callfunction(req, res, 'Get');
            }).put(function (req, res) {
                callfunction(req, res, 'Put');
            }).delete(function (req, res) {
                callfunction(req, res, 'Delete');
            });
    }
}

var possibleRoutes = [
    "/:name",
    "/:name/:specificFunction",
    "/:name/:id",
    "/:name/:specificFunction/:id",
    "/:name/:specificFunction/:id/:id2"
];


defineCommonRoutes(possibleRoutes);

var getResponseFromFile = function (name) {
    if (name) {
        return require("./app/" + name + ".js");
    }
}

var callfunction = function (req, res, type) {
    console.log(req.params);

    var params = req.params,
        name = params.name,
        functionName,
        runningFunction;

    var possibleFunctionsNames = createPossibleFunctionNames(req, res, type);

    if (name) {
        var fileJs = getResponseFromFile(name);

        for (var i = 0; i < possibleFunctionsNames.length; i++) {
            functionName = possibleFunctionsNames[i];
            if (!isEmpty(fileJs[functionName])) {
                runningFunction = fileJs[functionName];
                break;
            } else {
                if ((possibleFunctionsNames.length - 1) === i) {
                    res.send("Sorry file [" + name + ".js] doesn't have any of these [" + possibleFunctionsNames.join(",") + "] functions.");
                    return;
                }
            }
        }

        console.log(runningFunction);

        res.json(runningFunction.apply(this, [req, req.params, req.body, app, config]));
    }
} 

var createPossibleFunctionNames = function (req, res, type) {
    var possibilities = [];

    var params = req.params,
        name = params.name,
        functionName;

   
    if (params.specificFunction) {
        functionName = params.specificFunction;
    } else {
        functionName = params.name;
    }

    possibilities.push(functionName + type);
    possibilities.push(name + type);
    possibilities.push(functionName);
    possibilities.push(name);

    // console.log(possibilities);

    return possibilities;
}

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================



app.listen(port);

console.log('Running at :' + port);
