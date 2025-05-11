import type { APIRoute } from "astro";
import { setThemeCookie, type Theme } from "../../lib/theme";

export type ThemeRequest = {
    theme: Theme
};

export const POST: APIRoute = async({ request,cookies }) => {
    try{
        const body = await request.json() as ThemeRequest;
        setThemeCookie(cookies,body.theme);

        return new Response(null,{status: 200});

    }catch(e){
        console.log(e);
        return new Response(JSON.stringify(e),{status: 500});
    }

};

export const prerender = false;
