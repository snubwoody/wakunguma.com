import type {APIRoute} from "astro";

export const POST: APIRoute = ({request}) => {
    console.log(request);

    return new Response("Hello world!");
};

export const prerender = true;

