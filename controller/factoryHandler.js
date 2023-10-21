const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");
const APIfeatures = require("./../feature/APIFeature");

exports.createDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;

    const curDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: curDoc,
      },
    });
  });

exports.updateDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;

    const curDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      returnDocument: "after",
    });

    if (!curDoc) return next(new AppError("this docoment is not exist", 404));

    res.status(202).json({
      status: "success",
      data: {
        data: curDoc,
      },
    });
  });

exports.deleteDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const curDoc = await Model.findByIdAndDelete(req.params.id);

    if (!curDoc) return next(new AppError("this docoment is not exist", 404));

    res.status(204).json({
      status: "success",
      data: {
        data: curDoc,
      },
    });
  });

exports.findAllDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    let searchOj = {};
    if (req.params.categoryId) searchOj = { category: req.params.categoryId };
    if (req.params.productId) searchOj = { product: req.params.productId };

    const feature = new APIfeatures(req.query, Model.find(searchOj))
      .fillter()
      .sort()
      .fields()
      .pagination();

    const curDoc = await feature.responseqQuery;

    res.status(200).json({
      status: "success",
      result: curDoc.length,
      data: {
        data: curDoc,
      },
    });
  });

exports.findOneDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const curDoc = await Model.findOne({ _id: req.params.id });

    if (!curDoc) return next(new AppError("this docoment is not exist", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: curDoc,
      },
    });
  });

exports.deleteDocAndIsRef = (Model, RefTo) =>
  catchAsync(async (req, res, next) => {
    const docToUpdate = await Model.find({ category: req.params.id });

    const promises = docToUpdate.map(async (ref) => {
      ref.category = undefined;
      await ref.save({ validateBeforeSave: false });
    });

    await Promise.all(promises);

    const promises2 = RefTo.forEach(async (el) => {
      await el.findByIdAndDelete(req.params.id);
    });

    res.status(204).json({
      status: "success",
      data: { data: "docoment have been deleted" },
    });
  });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("please upload only images", 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadImage = () => upload.single("image");

exports.resizeImage = (path, imageName) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return;

    req.body.image = `${req.user._id}-${Date.now()}-${imageName}.jpeg`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path}/${req.body.image}`);

    next();
  });
