import { defineMiddleware } from "astro:middleware";
import { setThemeCookie } from "../lib/theme";

export const onRequest = defineMiddleware((context,next) => {
    if (!context.cookies.get("theme")){
        setThemeCookie(context.cookies,"light");
    }

    return next();
});
