const Constants = require('./Constants')

class Lib {
   constructor() {}

   randomInteger(min, max) {
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
   }
   
   createArray() {
      let arr = []
      for(let i = 0; i < Constants.ARR_SIZE; i++ ) {
         let randomNumber = this.randomInteger(Constants.MIN_NUMBER, Constants.MAX_NUMBER)
         arr.push(randomNumber)
      }
      return arr;
   }
}

module.exports = Lib;