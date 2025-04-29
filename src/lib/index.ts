// place files you want to import through the `$lib` alias in this folder.
export type Metadata = {
    title:string,
    author: string,
    published: string,
    layout: string,
    image: string,
    /** A brief description of the blog post */
    synopsis: string
}

export type BlogPost = {
    metadata: Metadata,
    url: string
}
