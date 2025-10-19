import {type CollectionEntry, getCollection} from "astro:content";

/**
 * Get all the articles in the `/blog` directory with the `preview`
 * field set to false.
 *
 * @returns a list of all the articles
 */
export const getPosts = async (): Promise<CollectionEntry<"articles">[]> => {
    let articles = await getCollection("articles",(post) => {
        return !post.data.preview;
    });

    articles = articles.sort((a,b) => a.data.published.getTime() + b.data.published.getTime());

    return articles;
};

