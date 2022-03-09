const { User } = require('../models');

// Set up Users Controller
const userController = {

    // Create a new User
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    // Get All Users
    getAllUsers(req, res) {
        User.find({})
            // populate users thoughts
            .populate({ path: 'thoughts', select: '-__v' })
            // populate user friends
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            // .sort({_id: -1})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Get single user by ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            // return if no user is found 
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    // Update a current User by ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.id }, 
            body, 
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err))
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                res.json({message: 'Successfully deleted user'});
            })
            .catch(err => res.status(400).json(err));
    },

    // Delete a current user by ID
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $push: { friends: params.friendId } }, 
            { new: true }
        )
            .populate({ path: 'friends', select: ('-__v') })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // Delete a current Friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $pull: { friends: params.friendId } }, 
            { new: true }
        )
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                res.json({message: 'Successfully deleted friend'});
            })
            .catch(err => res.status(400).json(err));
    }

};

// Export module users controller
module.exports = userController; 