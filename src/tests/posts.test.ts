import { test,expect } from "vitest";
import {getPosts} from "../lib";

// FIXME
test("Preview posts are filtered out", async () => {
    const posts = await getPosts();
    posts.forEach((post) => {
        if (post.data.preview) {
            throw "Preview posts are not supposed to be included";
        }
    });
});

test("Posts have correct author",async () => {
    const posts = await getPosts();
    posts.forEach((post) => {
        if (post.data.author != "Wakunguma Kalimukwa") {
            throw "Post does not have required frontmatter properties";
        }
    });
});
