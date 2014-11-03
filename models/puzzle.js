var mongoose = require('mongoose');

var PuzzleSchema = mongoose.Schema({
    content: String,
    solution: String,
    comment: String
});

mongoose.model('Puzzle', PuzzleSchema);