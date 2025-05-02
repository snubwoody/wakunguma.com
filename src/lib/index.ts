import { useTheme,type Theme } from "./theme";

export type Frontmatter = {
	title:string,
	author:string,
	published:string,
	/** A short description of the post */
	synopsis:string,
	image:string,
	file:string,
	url:string
}
export type BlogPost = {
    url: string,
    frontmatter: Frontmatter
}

export {
    useTheme,
    type Theme,
};
