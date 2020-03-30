// Seems like this file is only used when the server is first started up. What we are doing is just setting up the properties adn rules of our mtchmaking service I think. 

const queue = require('./structs/queue');
// Get ranges and their respective queues
const BINNED_QUEUES = queue.binRanges();
// A set is basically an array but values cannot be repeated. This is useful in this case since players cannot be queded twice
const ENQUEUED_PLAYERS = new Set();
const DEQUEUED_PLAYERS = {}
// Create the large array to get what skill range a user is in
const SKL_LOOKUP = queue.genKeyLookup();
let PROPERTIES = {}

//This is the skill ranges for our matchmaking service
PROPERTIES.SKL_LOOKUP = SKL_LOOKUP;

PROPERTIES.BINNED_QUEUES = BINNED_QUEUES;
PROPERTIES.ENQUEUED_PLAYERS = ENQUEUED_PLAYERS;
PROPERTIES.DEQUEUED_PLAYERS = DEQUEUED_PLAYERS;
//TODO: I'm assigning a function like this because I need
// DataStoreManager to be able to create nodes to add to the queue.
// I don't like doing this, and I should refactor the queue module
// or write a node manager class that ds_manager could use instead.
// Function used to create play queue
PROPERTIES.createPlayerNode = queue.createPlayerNode;
module.exports = PROPERTIES;
