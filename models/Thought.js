const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
//ThoughtsSchema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      },
      username: {
        type: String,
        required: true
      },
    
  reactions:[ReactionSchema],
},
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false
  }
);
// ReactionSchema
const ReactionSchema = new Schema({
  
  reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
  },
  reactionBody: {
      type: String,
      required: true,
      maxlength: 280
  },
  username: {
      type: String,
      required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
},
  {
      toJson: {
          getters: true
      }
  }
);

// get total count of comments and replies on retrieval
thoughtSchema.virtual('friendCount').get(function() {
return this.friends.length
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
