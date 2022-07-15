import {
  json,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { LinksFunction, MetaFunction, LoaderFunction } from "remix";

// import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [
    // { rel: "stylesheet", href: tailwindStylesheetUrl },
    // { rel: "stylesheet", href: 'https://cdn.jsdelivr.net/gh/kimeiga/bahunya@css/bahunya-0.1.3.css' },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.css",
    },
    // { rel: "stylesheet", href: 'https://unpkg.com/mvp.css' },
    // {
    //   rel: "stylesheet",
    //   href: "https://edwardtufte.github.io/tufte-css/tufte.css",
    // },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

// export const loader: LoaderFunction = async ({ request }) => {
//   return json<LoaderData>({
//     user: await getUser(request),
//   });
// };

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Link to="/"><h1>CashIT</h1></Link>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
