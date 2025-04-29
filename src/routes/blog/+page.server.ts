import type { PageServerLoad } from "./$types";
import type { BlogPost } from "$lib";


export const load: PageServerLoad = async ( {fetch}) =>{
    const response = await fetch('/api/blog');
    const posts = await response.json() as BlogPost[];
    
    return {
        posts
    };
};

export const prerender = true;
