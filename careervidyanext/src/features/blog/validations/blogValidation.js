export const validateBlogForm = ({ title, category }) => {
  const errors = {};

  if (!title?.trim()) {
    errors.title = "Title is required.";
  } else if (title.trim().length < 5) {
    errors.title = "Title should be at least 5 characters.";
  } else if (title.trim().length > 150) {
    errors.title = "Title should be under 150 characters.";
  }

  if (!category?.trim()) {
    errors.category = "Please choose a category.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
