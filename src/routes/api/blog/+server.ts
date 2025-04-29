import type { BlogPost, Metadata } from "$lib";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = () => {
    const imports = import.meta.glob(
        [
            '../../blog/**/*.md',
            '../../blog/**/*.svx'
        ],
        {
            eager:true
        }
    );

    const posts: BlogPost[] = Object.entries(imports).map(([path,module]) => {
        const url = path
            .replace('../../blog','/blog')
            .replace(/\/\+page\.(?:md|svx)$/,'');

        const metadata: Metadata = (module as any).metadata;
        return {
            url,
            metadata
        };
    });

    return new Response(JSON.stringify(posts));
};

export const prerender = true;
