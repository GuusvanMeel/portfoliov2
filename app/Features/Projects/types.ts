export type Project = {
    id: number;
    title: string;
    imageSrc: string;
    description: string;
    tags: string[];
    duration: string;
    githubLink: string;
    isVisible: boolean;
    updatedAt: string;
};
export type ProjectRow = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    is_visible: boolean;
    created_at: string;
    updated_at: string;
    duration: string;
    imagesrc: string;
    Github_Link: string;
}
export type ProjectInputData = {
    title: string;
    description: string;
    tags: string[];
    isVisible: boolean;
    duration: string;
    imageSrc: string;
    githubLink: string;
}