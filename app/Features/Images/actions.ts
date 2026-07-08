function getSupabaseUrl() {
  if (typeof process === "undefined") {
    return "";
  }

  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function cloudinaryImage(url: string, transformation: string) {
  if (!url.includes("/image/upload/")) return url;

  return url.replace(
    "/image/upload/",
    `/image/upload/${transformation}/`
  );
}

function supabasePublicImage(bucket: string, pathOrUrl: string) {
  if (!pathOrUrl) return "";

  // Als het al een volledige URL is, gewoon gebruiken
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const supabaseUrl = getSupabaseUrl();
  const cleanPath = pathOrUrl.replace(/^\/+/, "");

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

export const projectImage = {
  list: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_128,h_128,c_fill"),

  grid: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_800,h_450,c_fill"),

  formPreview: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_600,h_300,c_fill"),

  window: (url: string) =>
    cloudinaryImage(url, "f_auto,q_auto,w_1000,c_limit"),

  desktopIcon: (pathOrUrl: string) =>
    supabasePublicImage("DesktopIcons", pathOrUrl),
};