function cloudinaryImage(url: string, transformation: string) {
  if (!url.includes("/image/upload/")) return url;

  return url.replace(
    "/image/upload/",
    `/image/upload/${transformation}/`
  );
}

export const projectImage = {
  // Admin list: w-16 h-16 = 64x64 zichtbaar, 128x128 voor scherpe schermen
  list: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_128,h_128,c_fill"),

  // Admin grid: aspect-video, dus 16:9
  grid: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_800,h_450,c_fill"),

  // Edit form preview: klein previewvlak, maar iets groter houden zodat het scherp blijft
  formPreview: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_600,h_300,c_fill"),
};