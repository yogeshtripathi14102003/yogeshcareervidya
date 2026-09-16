/**
 * utilities/queryHelper.js
 *
 * Generic paginated + searchable query builder.
 * Reuse this across ANY controller (Student, Counselor, Lead, Admission, etc.)
 * instead of writing pagination/search logic separately each time.
 */

export const paginatedSearch = async (
  Model,
  baseFilter = {},
  reqQuery = {},
  searchFields = [],
  selectFields = "",
  sortOptions = { createdAt: -1 },
  maxLimit = 500,
  defaultLimit = 20
) => {
  const page = Math.max(1, parseInt(reqQuery.page) || 1);
  const limit = Math.min(maxLimit, parseInt(reqQuery.limit) || defaultLimit);
  const skip = (page - 1) * limit;
  const { search } = reqQuery;

  const filter = { ...baseFilter };

  if (search && search.trim() && searchFields.length) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // prevent regex injection
    const regex = new RegExp(escaped, "i");
    filter.$or = searchFields.map((field) => ({ [field]: regex }));
  }

  const [data, total] = await Promise.all([
    Model.find(filter)
      .select(selectFields)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
      pageSize: data.length,
    },
  };
};