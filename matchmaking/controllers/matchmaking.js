// CLASSES THAT HAVE FUNCTIONS THAT DEAL WITH QUEUE AND ACTUAL MATCHMAKING
// This deals with when a player has started searching for a match
const sendEmail = require('../../util/email')
const getCoords = require('../../util/getCoords')
const getMidpoint = require('../../util/getMidpoint')
const courtsFinder = require('../../util/courtsFinder')

class SearchingClientsManager{
  constructor(properties){
    this.properties = properties;
  }
  setEnqueued(user){
    // Store people who are already on the queue.
    this.properties.ENQUEUED_PLAYERS.add(user.id);
  }
  getEnqueued(user){
   
    return this.properties.ENQUEUED_PLAYERS.has(user.id)
  }
  removeFromEnqueued(id){
    delete this.properties.ENQUEUED_PLAYERS.delete(id);
  }
}


// This class deals with when a player has found a match
class MatchPairingManager{
  constructor(properties){
    this.properties = properties;
  }
  setDequeued(id, opponent_id){
    // Store dequeued player & requestor's id
    this.properties.DEQUEUED_PLAYERS[opponent_id] = id
  }
  hasBeenDequeued(id){
    return this.properties.DEQUEUED_PLAYERS[id];
  }
  removeFromDequeued(id){
    delete this.properties.DEQUEUED_PLAYERS[id];
  }
}

// This class creates the player queue data
class DataStoreManager{
  constructor(properties, searcher_manager, pairing_manager){
    this.properties = properties;
    this.searcher_manager = searcher_manager;
    this.pairing_manager = pairing_manager;
  }

  createPlayerNode(user, skl){
    return this.properties.createPlayerNode(user,  skl);
  }
  
  getBinKey(skl){
    return this.properties.SKL_LOOKUP[skl];
  }
  
  getQueueHead(bin_key){
    return this.properties.BINNED_QUEUES[bin_key].head
  }
  
  dequeueFromBin(bin_key){
    return this.properties.BINNED_QUEUES[bin_key].dequeue();
  }

  enqueueToBin(bin_key, player_node){
    this.properties.BINNED_QUEUES[bin_key].enqueue(player_node);
  }

  isQueueHead(bin_key, id){
    var top_of_queue = this.getQueueHead(bin_key);
    if (top_of_queue && top_of_queue.data.id == id){
      return true;
    }
  }

  removeQueuedInfo(id){
    /*
      Remove players from matching/searching player data store.
      Note: This doesn't remove players from the binned queue data structure.
    */

    this.pairing_manager.removeFromDequeued(id);
    this.searcher_manager.removeFromEnqueued(id);
  }
  
  getBinnedCompetitor(bin_key, id){
    // If you are at the top of queue, don't dequeue yourself
    // Otherwise you can be matched with yourself. This happens
    // if you are the only one in the queue.
    // Rememver it is a linked list not an array
    if (this.isQueueHead(bin_key, id)){
      return;
    }
    // We are checking if you need to be queued or not, if dequed is tru you don't need to wait because there was a match for you already
    var dequeued = this.dequeueFromBin(bin_key);

    if (dequeued){
      // Add dequeud client to dequeued lookup as a key
      // Add both players to the dequeed list
      this.pairing_manager.setDequeued(id, dequeued.data['id']);
      // Add yourself to dequeud lookup as a key
      // Note: The client never calls this when they are already queued.
      this.pairing_manager.setDequeued(dequeued.data['id'], id);
    }

    return dequeued
  }

  enqueueId(bin_key, user, skl){
    // Don't re-enqueue yourself
    if (!this.searcher_manager.getEnqueued(user)){
      // Putting the player in queue and creating the player data
      this.searcher_manager.setEnqueued(user);
      let player = this.createPlayerNode(user,skl);
      this.enqueueToBin(bin_key, player);
      return true;
    }
    else{
      return false;
    }
  }
}

class RouteHandler{
  constructor(properties, sc_mgr, mp_mgr, ds_mgr, req, res){
  }
}
// API ROUTE FUNCS
async function startMatchmakingHandler(properties, ds_manager, req, res){
  /*
     Check to see if there is already a match available for you. Otherwise
     add you to the queue.

     Note: You aren't actually "searching" the queue, because searching a
     queue costs O(n) time (at least in the worst case). You get added to the
     queue and wait "passively" for another player to dequeue you.

     There are a few cases you must consider before enqueueing yourself.
     - Have you been enqueued already, but were dequeued?
     - Have you been enqueued already?
     - Can I find a match for you without enqueuing you?

     If no to all of these ^ then I'll enqueue you.

  */
  const skl = req.body.skillLevel;
  console.log(req.user.username)
  if(!skl){
    return res.status(400).json({errors: {skl: 'You need to include a skill level in your request'}})
  }
  if(!req.body.phone){
    return res.status(400).json({errors: {phone: 'You need to include a phone number in your request'}})
  }
  const coords = await getCoords(req.body.address, req.body.city, 'Ontario')
  let user1 = {id:req.user.id, phone:req.body.phone, username:req.user.username, lat:coords.lat, lng:coords.lng}
  // This gets the persons match making range 
  var bin_key = ds_manager.getBinKey(skl);
  // Checks if the player has been dequeued, currently in a match
  var paired_id = ds_manager.pairing_manager.hasBeenDequeued(user1.id)
  // Checks if a player is already in queue
  var is_queued = ds_manager.searcher_manager.getEnqueued(user1);
  // console.log('Enqueued', properties.ENQUEUED_PLAYERS.size);
  // console.log('QUEUES', properties.BINNED_QUEUES);
  if (paired_id){
    return res.status(200).json({msg:'You were already queued, also, someone has matched with you'})
  }
  if (is_queued){
    return res.status(403).json({msg: 'You are already queued. Please wait for a match to be found.'})
  }else{
    console.log(user1)
    var competitor = ds_manager.getBinnedCompetitor(bin_key, user1.id);
    if (competitor){

      // DO STUFF HERE BECAUSE THIS IS WHEN SOMEBODYH HAS BEEN QUEED
      let user2 = competitor.data
      let locations = [];
      const midpoint  = await getMidpoint(user1.lat, user1.lng, user2.lat, user2.lng )
      await courtsFinder("school", midpoint.lat, midpoint.lng, locations)
      sendEmail(user1, user2, locations[0].vicinity)
      return res.status(200).json({status:2 , msg: 'I have a match for you already, no need to be in the queue.'})
    }
    else{
      ds_manager.enqueueId(bin_key,user1, skl)
      return res.status(200).json( {status:1, msg: 'You have been queued.'});
    }
  }

}

function statusHandler(properties, ds_manager,req, res){
  /*
    Request a client's status. If a match was made, tell client of opponent.
  */
  var user = req.user;
  // Checks if the player has a matche
  var competitor_matched = ds_manager.pairing_manager.hasBeenDequeued(user.id)
  // Check if the player is enqueued
  var is_queued = ds_manager.searcher_manager.getEnqueued(user);
  // console.log('Enqueued', properties.ENQUEUED_PLAYERS.size);
  // console.log('QUEUES', properties.BINNED_QUEUES);
  // console.log('Dequeued', Object.keys(properties.DEQUEUED_PLAYERS).length);
  // Response will include a status variable with 3 options
  // 0 means player was not found in queue
  // 1 Means player is still searching for match
  // 2 means player has found a match, check phone for info
  if (competitor_matched){
    return res.json({status:2, msg:'A match was found', competitor_id:competitor_matched });
  }
  else if (!is_queued){
    return res.json({status:0, msg:'You were not found in our searching players pool.' });
  }
  else{
    return res.json({status:1, msg:'A match has not been found yet. Keep polling.' });
  }
}

function updateStatusHandler(properties, ds_manager, req, res){
  // Request to tell server you are ready
  // Will remove you from matched/searching players
  // Once this is called, a player can restart matchmaking
  var user = req.user;
  // Check if the player has been dequeued
  if (ds_manager.pairing_manager.hasBeenDequeued(user.id) ||  ds_manager.searcher_manager.getEnqueued(user)){
    // REmove him from the dequeued list so he can matchmake again
    ds_manager.removeQueuedInfo(user.id);
    return res.status(200).json({status:0, msg:'You may now restart matchmaking service.'})
  }
  else{
    return res.status(404).json({status:-1, msg:'You are not matched yet or not queued. \
      Check your status to make sure you are queued first, and then wait to be matched.'})
  }

}

module.exports.startMatchmakingHandler = startMatchmakingHandler;
module.exports.statusHandler = statusHandler;
module.exports.updateStatusHandler = updateStatusHandler;

module.exports.MatchPairingManager = MatchPairingManager;
module.exports.SearchingClientsManager = SearchingClientsManager;
module.exports.DataStoreManager = DataStoreManager;
