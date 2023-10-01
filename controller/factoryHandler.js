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
    const curDoc = await Model.find({ _id: req.params.id });

    if (!curDoc) return next(new AppError("this docoment is not exist", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: curDoc,
      },
    });
  });
