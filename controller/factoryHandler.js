exports.createDoc = (Model) => async (req, res, next) => {
  const curDoc = await Model.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: curDoc,
    },
  });
};

exports.updateDoc = (Model) => async (req, res, next) => {
  const curDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    returnDocument: "after",
  });

  res.status(202).json({
    status: "success",
    data: {
      data: curDoc,
    },
  });
};

exports.deleteDoc = (Model) => async (req, res, next) => {
  const curDoc = await Model.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: {
      data: curDoc,
    },
  });
};

exports.findAllDoc = (Model) => async (req, res, next) => {
  const curDoc = await Model.find();

  res.status(200).json({
    status: "success",
    result: curDoc.length,
    data: {
      data: curDoc,
    },
  });
};

exports.findOneDoc = (Model) => async (req, res, next) => {
  const curDoc = await Model.find({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    data: {
      data: curDoc,
    },
  });
};
