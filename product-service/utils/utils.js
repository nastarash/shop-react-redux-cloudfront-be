import { isNumber, isString } from "lodash";

export const mergeById = (a1, a2) => {
  const mergedArr = a1.map((itm) => ({
    ...a2.find((item) => item.product_id === itm.id && item),
    ...itm,
  }));
  return mergedArr.map(({ id, count, price, title, description }) => ({
    id,
    count,
    price,
    title,
    description,
  }));
};

export const validateBody = ({ price, title, description, count }) => {
  const isPriceValid = price && isNumber(price);
  const isTitleValid = title && isString(title);
  const isDescriptionValid = description && isString(description);
  const isCountValid = count && isNumber(count);
  return isPriceValid && isTitleValid && isDescriptionValid && isCountValid;
};
