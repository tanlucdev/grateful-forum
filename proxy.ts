import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
        // Forward the refreshed cookie header through the existing i18n rewrite.
        const overrides = response.headers.get("x-middleware-override-headers");
        const forwarded = new Set(overrides === null ? request.headers.keys() : overrides.split(",").filter(Boolean));
        if (overrides === null) {
          request.headers.forEach((value, name) => response.headers.set(`x-middleware-request-${name}`, value));
        }
        forwarded.add("cookie");
        response.headers.set("x-middleware-override-headers", [...forwarded].join(","));
        response.headers.set("x-middleware-request-cookie", request.headers.get("cookie") ?? "");
      },
    },
  });

  // Refresh cookies only; server loaders still verify identity with getUser().
  await supabase.auth.getSession();
  return response;
}

export const config = {
  matcher: ["/((?!api|auth/callback|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
