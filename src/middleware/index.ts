import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context,next) => {
    console.log(context.cookies.get("theme"));
    if (!context.cookies.get("theme")){
        context.cookies.set("theme","light",{
            path: "/",
            secure:true,
            sameSite: "strict",
            maxAge: 3600 * 24 * 365 * 100 // Set a really long expiry (100 years)
        });
    }

    return next();
});
