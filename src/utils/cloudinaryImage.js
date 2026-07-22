export const cloudinaryResize = (url, { width, height, crop = "limit" } = {}) => {
  if (!url || !url.includes("/upload/")) return url;
  const transform = `w_${width},h_${height},c_${crop},q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${transform}/`);
};
