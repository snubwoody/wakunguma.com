import { test } from "vitest";
import {getPosts} from "../lib";
import { createSubscriber } from "../lib/subscriber";

test("Preview posts are filtered out", () => {
    const posts = getPosts();
    posts.forEach((post) => {
        if (post.frontmatter.preview) {
            throw "Preview posts are not supposed to be included";
        }
    });
});

test("Posts have required features",() => {
    const posts = getPosts();
    posts.forEach((post) => {
        if (
            post.frontmatter.author != "Wakunguma Kalimukwa" ||
            !post.frontmatter.title || !post.frontmatter.published || !post.frontmatter.image
        ) {
            throw "Post does not have required frontmatter properties";
        }
    });
});

