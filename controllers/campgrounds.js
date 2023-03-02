const Campground = require('../models/campground');
const catchAsync = require('../utilis/catchAsync');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mapboxToken = process.env.MAPBOX_TOKEN

const geoCoder = mbxGeocoding({ accessToken: mapboxToken })



module.exports.AllCampgrounds = catchAsync(async (req, res) => {
    const campground = await Campground.find({});

    res.render('campgrounds/All', { campground, title: 'All campgrounds' });
})

module.exports.renderNewForm = catchAsync(async (req, res) => {
    res.render('campgrounds/new', { title: 'New campground' });
})

module.exports.createNewCampground = catchAsync(async (req, res) => {
    const { name, location, image, price, description } = req.body;

    const geoData = await geoCoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()

    const campground = new Campground({ name, location, image, price, description });
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map((f) => ({ url: f.path, fileName: f.filename }))
    campground.author = req.user._id;
    await campground.save();

    req.flash('success', 'Campground successfully created !');
    res.redirect('/campgrounds');
})

module.exports.showCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('author').
        populate({
            path: 'reviews',
            populate: { path: 'author' }
        })

    res.render('campgrounds/show', { campground, title: `${campground.name} details` });
})


module.exports.renderEditFrom = catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground, title: `Edit ${campground.name}` });
})



module.exports.editCampground = catchAsync(async (req, res) => {

    const { id } = req.params

    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()


    const campground = await Campground.findByIdAndUpdate(id, req.body, { new: true });
    const imgs = req.files.map((f) => ({ url: f.path, fileName: f.filename }))
    campground.image.push(...imgs);
    campground.geometry = geoData.body.features[0].geometry
    await campground.save();


    if (req.body.deleteImage) {
        for (let fileName of req.body.deleteImage) {
            await cloudinary.uploader.destroy(fileName);
        }
        await campground.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImage } } } });
    }

    req.flash('success', 'Campground successfully updated !');

    res.redirect(`/campgrounds/${id}`);
})


module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect(`/campgrounds`);

})