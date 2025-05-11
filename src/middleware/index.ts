import { defineMiddleware } from "astro:middleware";
import { setThemeCookie } from "../lib/theme";

export const onRequest = defineMiddleware((context,next) => {
    console.log(context.cookies.get("theme"));
    if (!context.cookies.get("theme")){
        setThemeCookie(context.cookies,"light");
    }
    

    return next();
});
