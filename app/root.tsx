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

import holo from "~/assets/holo.avif";
import { RootLogo } from "~/assets/root-logo";
import { themeSessionResolver, getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

import { DarkModeToggle } from "./components/dark-mode-toggle";
import { MultiStepProgress } from "./components/multi-step-progress";
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
    <div vaul-drawer-wrapper="" className="relative bg-background">
      <img
        src={holo}
        className="absolute top-0 right-0 z-0 min-h-2/5 opacity-80 dark:hue-rotate-90 dark:opacity-25"
        alt=""
      />
      <header className="relative w-full flex justify-between items-center p-2 z-10">
        <div className="flex flex-[2]">
          <Link
            to="/"
            className="block start p-2 border border-transparent rounded-md outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:border-primary"
          >
            <RootLogo />
          </Link>
        </div>
        <DarkModeToggle />
      </header>
      {/* <MultiStepProgress className="relative z-1 mx-auto py-4 px-6 max-w-screen-lg rounded-md border bg-background/75 shadow-xl" /> */}
      <MultiStepProgress
        location={location}
        className="mx-auto px-4 mt-1 lg:-mt-2 max-w-screen-md"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ x: `0%`, opacity: 0 }}
          animate={{ x: "0", opacity: 1 }}
          exit={{ x: `-0%`, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="min-h-[calc(100vh-52px)] flex justify-center px-4 py-14 sm:py-24"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {/* <DarkModeToggle className="fixed bottom-2 right-2" /> */}
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
