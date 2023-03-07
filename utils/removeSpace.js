export const removeSpace = (entries) => {
  Object.keys(entries).forEach(function (key) {
    entries[key] = entries[key].split("+").join(" ");
  });
  return entries;
};
