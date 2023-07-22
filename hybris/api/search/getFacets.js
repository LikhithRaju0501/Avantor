const searchModel = require("./searchModel");

const getFacets = async (searchTerm) => {
  const data = await searchModel.find();

  // console.log(data);
  return "abc";
};

module.exports = {
  getFacets,
};
