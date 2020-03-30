// Linked list object
class Node{
  constructor(data){
    this.next = null;
    this.previous = null;
    this.data = data;
  }
}
// This creates the player queue data using the node class
function createPlayerNode(user, skl){
  return new Node({'id': user.id,'username':user.username, 'phone':user.phone, 'skl': skl, "lat":user.lat, "lng":user.lng});
}

function NotANodeError(message,extra){
  Error.captureStackTrace(this, this.constructor);
  this.message = message;
  this.constructor.name;
  this.extra = extra;
}

class Queue{
  /*
    This is essentially a linked list implementation of a queue.
  */
  constructor(){
    this.head = null;
    this.tail = null;
  }
  // Thgis functions puts a player in queue
  enqueue(node){

    if (!node || !node.hasOwnProperty('data')){
      throw(new NotANodeError("No null/undefined nodes are allowed. \
        Must have data property."));
    }

    if(!this.tail && !this.head){
       // Empty queue
       this.head = node;
    }

    else if(!this.tail && this.head){
       // Only 1 enqueued 
       node.next = this.head;
       this.head.previous = node
       this.tail = node;
       
    }

    else{
       // More than 1 enqueued
       this.tail.previous = node
       node.next = this.tail;
       this.tail = node;
    }
  };

  dequeue(){
    /* Pop the head from the queue by changing head, previous, and
       next connections. Rely on GC to clean up unreferenced objects.
    */
    if (this.head){
      var node = this.head;

      if (this.head.previous){
        this.head.previous.next = null;
        this.head = this.head.previous;
      }
      else{
        this.head = null;
      }
      return node;
    }

  };

}


// From What I can tell, this basically just sets the matchmaking levels. So for example one skill category would be 0-750
function genKeyLookup(){
  // Generate an array to lookup hard coded keys of bin ranges.
  // For example, index 800 should have the value: '751-1000'
  // TODO: Generate these bins based off of skl freq data
  // Sobasically if a user has a skill level of 100, it would get the 100 index of the array, which would have a value of 0-500
  // Maybe look into a better way of creating ranges, seems like it uses a lot of emmeory
  var key_array = [];
  for (i = 0; i < 501; i++){
    key_array.push('0-500');
  }
  for (i = 1; i < 251; i++){
    key_array.push('501-750');
  }
  for (i = 1; i < 251; i++){
    key_array.push('751-1000');
  }
  return key_array;
}

function binRanges(){
  // Create the bins (queues) for hard coded example skl bin ranges.
  // TODO: Create these bins based off of skl frequency data
  // This creates the linked list for each skill range. Each skill range will have there own indiviual queue
  var first_range = new Queue();
  var second_range = new Queue();
  var third_range = new Queue();
  
  return {
    '0-500': first_range,
    '501-750': second_range,
    '751-1000': third_range,
  }
}

module.exports.Queue = Queue
module.exports.Node = Node
module.exports.NotANodeError = NotANodeError
module.exports.binRanges = binRanges
module.exports.genKeyLookup = genKeyLookup
module.exports.createPlayerNode = createPlayerNode
