class APIfeatures {
  constructor(requistQuery, responseqQuery) {
    this.requistQuery = requistQuery;
    this.responseqQuery = responseqQuery;
  }

  fillter() {
    const requistObj = { ...this.requistQuery };
    const deleteFromObj = ["sort", "fields", "limit", "page"];
    deleteFromObj.forEach((el) => delete requistObj[el]);

    let querystr = JSON.stringify(requistObj);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (el) => `$${el}`);

    this.responseqQuery = this.responseqQuery.find(JSON.parse(querystr));
    return this;
  }

  sort() {
    if (this.requistQuery.sort) {
      const sortBy = this.requistQuery.sort.split(",").join(" ");
      this.responseqQuery = this.responseqQuery.sort(sortBy);
      return this;
    }
    this.responseqQuery = this.responseqQuery.sort("-avregeRate");
    return this;
  }
}

module.exports = APIfeatures;
