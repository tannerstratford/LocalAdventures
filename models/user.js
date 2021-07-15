const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  resetToken: String,
  resetTokenExpiration: Date,
  ToDo: {
    items: [
      {
        adventureId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        imageUrl: {
          type: String,
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  CompleteAdventures: {
    items: [
      {
        adventureId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        imageUrl: {
          type: String,
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToToDo = function(adventure) {
  const ToDoAdventureIndex = this.ToDo.items.findIndex(cp => {
    return cp.adventureId.toString() === adventure._id.toString();
  });
  let newQuantity = 1;
  const updatedToDoItems = [...this.ToDo.items];

  if (ToDoAdventureIndex >= 0) {
    newQuantity = this.ToDo.items[ToDoAdventureIndex].quantity + 1;
    updatedToDoItems[ToDoAdventureIndex].quantity = newQuantity;
  } else {
    updatedToDoItems.push({
      adventureId: adventure._id,
      imageUrl: adventure.imageUrl,
      title: adventure.title,
      quantity: newQuantity
    });
  }
  const updatedToDo = {
    items: updatedToDoItems
  };
  this.ToDo = updatedToDo;
  return this.save();
};

userSchema.methods.removeFromToDo = function(adventureId) {
  const updatedToDoItems = this.ToDo.items.filter(item => {
    return item.adventureId.toString() !== adventureId.toString();
  });
  this.ToDo.items = updatedToDoItems;
  return this.save();
};

userSchema.methods.clearToDo = function() {
  this.ToDo = { items: [] };
  return this.save();
};



userSchema.methods.addToCompleteAdventures = function(adventure) {
  const CompleteAdventuresAdventureIndex = this.CompleteAdventures.items.findIndex(cp => {
    return cp.adventureId.toString() === adventure._id.toString();
  });
  let newQuantity = 1;
  const updatedCompleteAdventuresItems = [...this.CompleteAdventures.items];

  if (CompleteAdventuresAdventureIndex >= 0) {
    newQuantity = this.CompleteAdventures.items[CompleteAdventuresAdventureIndex].quantity + 1;
    updatedCompleteAdventuresItems[CompleteAdventuresAdventureIndex].quantity = newQuantity;
  } else {
    updatedCompleteAdventuresItems.push({
      adventureId: adventure._id,
      title: adventure.title,
      imageUrl: adventure.imageUrl,
      quantity: newQuantity
    });
  }
  const updatedCompleteAdventures = {
    items: updatedCompleteAdventuresItems
  };
  this.CompleteAdventures = updatedCompleteAdventures;
  return this.save();
};

userSchema.methods.removeFromCompleteAdventures = function(adventureId) {
  const updatedCompleteAdventuresItems = this.CompleteAdventures.items.filter(item => {
    return item.adventureId.toString() !== adventureId.toString();
  });
  this.CompleteAdventures.items = updatedCompleteAdventuresItems;
  return this.save();
};

userSchema.methods.clearCompleteAdventures = function() {
  this.CompleteAdventures = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, ToDo, id) {
//     this.name = username;
//     this.email = email;
//     this.ToDo = ToDo; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   addToToDo(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name
//           }
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
