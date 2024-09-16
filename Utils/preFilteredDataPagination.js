const preFilteredDataPagination = (req, data) => {
  req.query.limit = req.query.limit || 1000000000000000; // Set a reasonable default limit
  req.query.page = req.query.page || 1;

  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / limit);
  const hasPrevPage = req.query.page > 1;
  const hasNextPage = req.query.page < totalPages;
  return {
    data: paginatedData,
    totalPages,
    totalavailables: data.length,
    hasPrevPage,
    hasNextPage,
  };
};

module.exports = preFilteredDataPagination;
