const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  users: {
    type: String,
    required: false
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

userSchema.methods.addToCityList = function(adventure) {
  const CityListAdventureIndex = this.CityList.items.findIndex(cp => {
    return cp.adventureId.toString() === adventure._id.toString();
  });
  let newQuantity = 1;
  const updatedCityListItems = [...this.CityList.items];

  if (CityListAdventureIndex >= 0) {
    newQuantity = this.CityList.items[CityListAdventureIndex].quantity + 1;
    updatedCityListItems[CityListAdventureIndex].quantity = newQuantity;
  } else {
    updatedCityListItems.push({
      adventureId: adventure._id
    });
  }
  const updatedCityList = {
    items: updatedCityListItems
  };
  this.CityList = updatedCityList;
  return this.save();
};

module.exports = mongoose.model('Cities', userSchema);
