const router = require('express').Router();
const {
    getThoughts,
    getThoughtById,
  addThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
 
} = require('../../controllers/thought-controller');


router.route('/').get(getThoughts).post(addThought);


router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);


router.route('/:thoughtId/reactions').delete(deleteReaction).post(addReaction);

module.exports = router;
