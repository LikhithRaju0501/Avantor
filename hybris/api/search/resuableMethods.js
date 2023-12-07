const searchModel = require("./searchModel");

const getFacets = async (searchTerm) => {
  const data = await searchModel.find();

  // console.log(data);
  return "abc";
};

const getPaginatedData = (
  totalData,
  currentPage,
  pageSize,
  totalPages,
  totalResults,
  searchTerm,
  currentQuery
) => {
  const entriesToSend = totalData.slice(
    currentPage * pageSize,
    getMin((currentPage + 1) * 10, totalResults)
  );
  return {
    entries: [...entriesToSend],
    pagination: { currentPage, pageSize, totalPages, totalResults },
    ...(searchTerm && { searchTerm }),
    ...(currentQuery && { currentQuery }),
  };
};

module.exports = {
  getFacets,
  getPaginatedData,
};
