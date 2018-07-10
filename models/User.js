const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: String,
  password: String
});

mongoose.model('User', userSchema);
