import { defineMiddleware } from "astro:middleware";
import { setThemeCookie } from "../lib/theme";

// TODO: change this to client side so that pages can be prerendered
export const onRequest = defineMiddleware((context,next) => {
    if (!context.cookies.get("theme")){
        console.log("Middle ware");
        setThemeCookie(context.cookies,"light");
    }

    return next();
});
