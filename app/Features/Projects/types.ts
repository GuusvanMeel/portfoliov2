export type Project = {
  // Complete project zoals je app het gebruikt na mapping vanuit de database
  id: number;
  title: string;
  imageSrc: string;
  description: string;
  desktopIconSrc: string;
  tags: string[];
  duration: string;
  githubLink: string;
  isVisible: boolean;
  updatedAt: string;
};

export type DisplayProject = {
  // Alleen de projectdata die nodig is om een project publiek te tonen
  id: number;
  title: string;
  imageSrc: string;
  description: string;
  desktopIconSrc: string;
  tags: string[];
  duration: string;
  githubLink: string;
};

export type ProjectRow = {
  // Ruwe project row zoals die uit Supabase komt
  id: number;
  title: string;
  description: string;
  desktop_icon_src: string;
  tags: string[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  duration: string;
  imagesrc: string;
  Github_Link: string;
};

export type ProjectInputData = {
  // Data die nodig is om een project aan te maken of te updaten vanuit je form
  title: string;
  description: string;
  tags: string[];
  isVisible: boolean;
  duration: string;
  imageSrc: string;
  githubLink: string;
};