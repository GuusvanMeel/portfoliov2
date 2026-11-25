export type Project = {
  // Complete project as the app uses it after mapping from the database
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
  // Only the project data needed to show a project publicly
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
  // Raw project row as it comes from Supabase
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
  // Data needed to create or update a project from the admin form
  title: string;
  description: string;
  tags: string[];
  isVisible: boolean;
  duration: string;
  imageSrc: string;
  githubLink: string;
};
