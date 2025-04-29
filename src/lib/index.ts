import { useTheme,type Theme } from "./theme"
export interface Frontmatter{
	title:string,
	author:string,
	published:string,
	/** A short description of the post */
	synopsis:string,
	image:string,
	file:string,
	url:string
}

export {
    useTheme,
    Theme
};
