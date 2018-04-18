var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

   title: {
      type: String,
      required: true
   },

   link: {
      type: String,
      required: true
   },

   summary: {
      type: String,
      required: true
   },
   notes: {
      type: Array
   }

});


var articles = mongoose.model("Articles", ArticleSchema);


module.exports = articles;
