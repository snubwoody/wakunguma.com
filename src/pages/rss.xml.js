import rss from "@astrojs/rss";
import { getPosts } from "../lib";

// TODO:
// - Actually check the image size and type
// - Make this static
export async function GET(context){
    const posts = getPosts();

    return rss({
        title: "Waku's blog",
        description: "My personal blog",
        site: context.site ?? "https://wakunguma.com",
        items: posts.map(post => {
            return ({
                title: post.frontmatter.title,
                description: post.frontmatter.synopsis,
                pubDate: new Date(post.frontmatter.published),
                link: post.url,
                enclosure:{
                    url: post.frontmatter.image,
                    length: post.frontmatter.imageSize,
                    type: "image/png"
                }
            });
        })
    });
}
