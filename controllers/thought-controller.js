const { Thought, User } = require('../models');

// setup Thought controller
const thoughtController = {
    createThought({ body }, res) {
        Thought.create(body)
            .then(( dbThoughtData ) => {
                console.log(dbThoughtData)
                return User.findOneAndUpdate(
                    { _id: body.userId }, 
                    { $push: { thoughts: dbThoughtData._id } }, 
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this ID!' });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err));
    },
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({ path: 'reactions', select: '-__v' })
            .populate({ path: 'thoughts', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts with this particular ID!' });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // update current thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id }, 
            body, 
            { new: true, runValidators: true }
        )
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this ID!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // delete a thought by ID
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this ID!' });
                    return;
                }
                res.json({message: 'Successfully deleted the thought'});
            })
            .catch(err => res.status(400).json(err));
    },

    // add a new reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $push: { reactions: body } } , 
            { new: true, runValidators: true }
        )
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this ID!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err))
    },

    // delete a reaction by ID
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $pull: { reactions: params.reactionId  } }, 
            { new: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this ID!' });
                    return;
                }
                res.json({message: 'Successfully deleted the reaction'});
            })
            .catch(err => res.status(400).json(err));
    }
};


// export module thought controller
module.exports = thoughtController;
  