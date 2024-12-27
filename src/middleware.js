import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function middleware(req) {

    const path = req.nextUrl.pathname;
    const PublicPath = path === "/Signup" || path === "/Signin"
    const cookieStore = await cookies();
    const val = cookieStore.get("jwt")?.value || "";

    if (PublicPath && val !== "") {
        return NextResponse.redirect(new URL("/", req.nextUrl))
    }

    if (!PublicPath && val === "") {
        return NextResponse.redirect(new URL("/Signin", req.nextUrl))
    }

}

export const config = {
    matcher: ["/Signup", "/Signin"],
}