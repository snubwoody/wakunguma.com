import {type CollectionEntry, getCollection} from "astro:content";

/**
 * Returns all the articles in the articles collection with the `preview`
 * field set to false.
 */
export const getPosts = async (): Promise<CollectionEntry<"articles">[]> => {
    let articles = await getCollection("articles",(post) => {
        return !post.data.preview;
    });

    articles = articles.sort((a,b) => a.data.published.getTime() + b.data.published.getTime());

    return articles;
};

