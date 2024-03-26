import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useOutlet,
  useRouteError,
} from "@remix-run/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { RootLogo } from "~/assets/root-logo";
import { themeSessionResolver, getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { DarkModeToggle } from "./components/dark-mode-toggle";

import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// Return the theme from the session storage using the loader
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { getTheme } = await themeSessionResolver(request);
  return { theme: getTheme() };
  // return json({ user: await getUser(request) });
};

// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="h-full">
        <Layout>{outlet}</Layout>
        {/* <ScrollRestoration /> */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const user = useOptionalUser();
  const location = useLocation();

  return (
    // eslint-disable-next-line react/no-unknown-property
    <div vaul-drawer-wrapper="" className="bg-background">
      <header className="w-full flex justify-between items-center p-2 z-10">
        <Link
          to="/"
          className="p-2 border border-transparent rounded-md outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:border-primary"
        >
          <RootLogo />
        </Link>
        <DarkModeToggle />
      </header>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ x: `0%`, opacity: 0 }}
          animate={{ x: "0", opacity: 1 }}
          exit={{ x: `-0%`, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="min-h-fit flex justify-center px-4 py-14 sm:py-24"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

// export function ErrorBoundary() {
//   const error = useRouteError();
//   let status = 500;
//   let message = "An unexpected error occurred.";
//   if (isRouteErrorResponse(error)) {
//     status = error.status;
//     switch (error.status) {
//       case 404:
//         status = 404;
//         message = "Page Not Found";
//         break;
//     }
//   } else {
//     console.error(error);
//   }

//   return (
//     <Layout>
//       <div className="container prose py-8">
//         <h1>{status}</h1>
//         <p>{message}</p>
//       </div>
//     </Layout>
//   );
// }
