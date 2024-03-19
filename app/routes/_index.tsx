import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { RootLogo } from "~/assets/root-logo";
import { AddVehicleDrawer } from "~/components/add-vehicle-drawer";
import { DarkModeToggle } from "~/components/dark-mode-toggle";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();

  return (
    // eslint-disable-next-line react/no-unknown-property
    <div vaul-drawer-wrapper="">
      <div className="bg-background">
        <header className="flex justify-between items-center p-2">
          <RootLogo className="ml-2" />
          <DarkModeToggle />
        </header>
        <main className="relative min-h-screen flex items-center justify-center gap-3">
          <AddVehicleDrawer />
        </main>
      </div>
    </div>
  );
}
