import rss from "@astrojs/rss";
import { getPosts } from "../lib";
import fs from "node:fs";
import path from "node:path";

export async function GET(context){
    const posts = getPosts();

    return rss({
        title: "Waku's blog",
        description: "My personal blog",
        site: context.site ?? "https://wakunguma.com",
        items: posts.map(post => {
            const imagePath = path.join("public", post.frontmatter.image);
            const { size } = fs.statSync(imagePath);
            return ({
                title: post.frontmatter.title,
                description: post.frontmatter.synopsis,
                pubDate: new Date(post.frontmatter.published),
                link: post.url,
                enclosure:{
                    url: post.frontmatter.image,
                    length: size,
                    type: "image/png"
                }
            });
        })
    });
}
