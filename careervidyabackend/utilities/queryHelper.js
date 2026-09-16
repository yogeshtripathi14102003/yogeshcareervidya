// /**
//  * utilities/queryHelper.js
//  *
//  * Generic paginated + searchable query builder.
//  * Reuse this across ANY controller (Student, Counselor, Lead, Admission, etc.)
//  * instead of writing pagination/search logic separately each time.
//  */

// export const paginatedSearch = async (
//   Model,
//   baseFilter = {},
//   reqQuery = {},
//   searchFields = [],
//   selectFields = "",
//   sortOptions = { createdAt: -1 },
//   maxLimit = 500,
//   defaultLimit = 20
// ) => {
//   const page = Math.max(1, parseInt(reqQuery.page) || 1);
//   const limit = Math.min(maxLimit, parseInt(reqQuery.limit) || defaultLimit);
//   const skip = (page - 1) * limit;
//   const { search } = reqQuery;

//   const filter = { ...baseFilter };

//   if (search && search.trim() && searchFields.length) {
//     const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // prevent regex injection
//     const regex = new RegExp(escaped, "i");
//     filter.$or = searchFields.map((field) => ({ [field]: regex }));
//   }

//   const [data, total] = await Promise.all([
//     Model.find(filter)
//       .select(selectFields)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit)
//       .lean(),
//     Model.countDocuments(filter),
//   ]);

//   return {
//     data,
//     pagination: {
//       total,
//       pages: Math.ceil(total / limit) || 1,
//       currentPage: page,
//       pageSize: data.length,
//     },
//   };
// };

/**
 * utilities/queryHelper.js
 *
 * Generic searchable query builder with optional pagination.
 *
 * Reuse this across ANY controller:
 * Student, Counselor, Lead, Admission, etc.
 *
 * Pagination:
 * - By default: ALL records
 * - If reqQuery.limit is provided: pagination is applied
 *
 * Examples:
 * GET /api/students
 * → ALL students
 *
 * GET /api/students?page=1&limit=20
 * → 20 students
 *
 * GET /api/students?page=2&limit=50
 * → 50 students
 *
 * GET /api/students?search=rahul
 * → ALL matching students
 */

export const paginatedSearch = async (
  Model,
  baseFilter = {},
  reqQuery = {},
  searchFields = [],
  selectFields = "",
  sortOptions = { createdAt: -1 },
  maxLimit = 500,
  defaultLimit = null
) => {
  try {
    const { search } = reqQuery;

    // --------------------------------------------------
    // BASE FILTER
    // --------------------------------------------------
    const filter = { ...baseFilter };

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------
    if (
      search &&
      typeof search === "string" &&
      search.trim() &&
      searchFields.length
    ) {
      // Escape regex special characters
      const escaped = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const regex = new RegExp(escaped, "i");

      filter.$or = searchFields.map((field) => ({
        [field]: regex,
      }));
    }

    // --------------------------------------------------
    // PAGINATION
    // --------------------------------------------------

    /*
     * If limit is NOT provided:
     * → Return ALL records
     *
     * If limit IS provided:
     * → Apply pagination
     */

    const hasLimit =
      reqQuery.limit !== undefined &&
      reqQuery.limit !== null &&
      reqQuery.limit !== "" &&
      !isNaN(parseInt(reqQuery.limit));

    let page = 1;
    let limit = null;
    let skip = 0;

    if (hasLimit) {
      page = Math.max(1, parseInt(reqQuery.page) || 1);

      limit = Math.min(
        maxLimit,
        Math.max(1, parseInt(reqQuery.limit))
      );

      skip = (page - 1) * limit;
    } else if (defaultLimit !== null) {
      page = Math.max(1, parseInt(reqQuery.page) || 1);

      limit = Math.min(
        maxLimit,
        Math.max(1, defaultLimit)
      );

      skip = (page - 1) * limit;
    }

    // --------------------------------------------------
    // BUILD QUERY
    // --------------------------------------------------

    let dataQuery = Model.find(filter)
      .select(selectFields)
      .sort(sortOptions);

    // Apply pagination ONLY when limit exists
    if (limit !== null) {
      dataQuery = dataQuery
        .skip(skip)
        .limit(limit);
    }

    // --------------------------------------------------
    // FETCH DATA + TOTAL
    // --------------------------------------------------

    const [data, total] = await Promise.all([
      dataQuery.lean(),
      Model.countDocuments(filter),
    ]);

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return {
      data,

      pagination: {
        total,

        pages:
          limit !== null
            ? Math.ceil(total / limit) || 1
            : 1,

        currentPage: page,

        pageSize: data.length,

        limit: limit ?? total,

        hasPagination: limit !== null,
      },
    };
  } catch (error) {
    console.error("paginatedSearch Error:", error);
    throw error;
  }
};