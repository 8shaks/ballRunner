// Routing methods for retrieving and updating user info
var router = require('express').Router();
var matchmaking = require('../../matchmaking/controllers/matchmaking');
// These are the general functions that we use whenthe api endpoints are hit
var startMatchmakingHandler = matchmaking.startMatchmakingHandler;
var statusHandler = matchmaking.statusHandler;
var updateStatusHandler = matchmaking.updateStatusHandler;
const auth = require('../../middleware/auth');


function getDataStoreManager(properties){
  // Here we are setting up our functions based on the properties object
  // These are the actual functions that will do the work behind the scenes
  var sc_manager = new matchmaking.SearchingClientsManager(properties);
  var pm_manager = new matchmaking.MatchPairingManager(properties);
  var ds_manager = new matchmaking.DataStoreManager(properties, sc_manager, pm_manager);
  return ds_manager;
}

// I wrapped the router module because I want properties to be created
// in the server module and passed to the matchmaking handler
// This is where the actual rest api endpoints are, routerClosure is only called once when the server is first started
function routerClosure(properties){
  ds_manager = getDataStoreManager(properties);
  router.get('/', (req, res) => {
    res.json({ response: 'get the html form for submitting the matchmaking request / that supports polling' });
  });
  // All these functions once these endpoints are hit
  router.post('/start', auth, function(req, res) {startMatchmakingHandler(properties, ds_manager, req, res)});
  router.get('/status',auth, function(req, res) {statusHandler(properties, ds_manager, req, res)});
  // This should be an admin only route
  router.get('/update',auth, function(req, res) {updateStatusHandler(properties, ds_manager, req, res)});

  return router
};

module.exports = routerClosure;
