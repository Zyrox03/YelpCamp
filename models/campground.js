const mongoose = require('mongoose')
const { Schema } = mongoose
const Review = require('./reviews');


const imageSchema = new Schema(
  {
    url: String,
    fileName: String,
  }
);

imageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };


const campgroundSchema = new Schema(
  {
    name: String,
    price: Number,
    image: [
      imageSchema
    ],
    description: String,
    location: String,
    geometry: {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ]
  }
  ,opts
)

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.name}</a><strong>
  <p>${this.description.substring(0, 30)}...</p>`
});



campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

const Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground