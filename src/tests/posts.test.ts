import { test } from "vitest";
import { getPosts } from "../lib";

test("Preview posts are filtered out", () => {
    const posts = getPosts();
    posts.forEach((post) => {
        if (post.frontmatter.preview) {
            throw "Preview posts are not supposed to be included";
        }
    });
});
