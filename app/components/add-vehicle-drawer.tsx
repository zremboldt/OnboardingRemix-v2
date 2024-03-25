import { useFetcher } from "@remix-run/react";
import { Car, CarFront, CirclePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";

export const AddVehicleDrawer = () => {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setIsOpen(false);
    }
  }, [fetcher]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="mr-2 h-4 w-4" /> Add vehicle
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto flex items-center sm:rounded-2xl sm:bottom-4 sm:after:hidden">
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="ADD_VEHICLE" />
          <div className="flex flex-col gap-9 max-w-md m-4 sm:my-8">
            <div className="flex flex-col gap-4">
              <DrawerTitle>What’s the VIN?</DrawerTitle>
              <Input
                name="vin"
                placeholder="VIN"
                onChange={(e) =>
                  (e.target.value = e.target.value.toUpperCase())
                }
              />
              {fetcher.state === "idle" && fetcher.data?.error ? (
                <p className="text-destructive text-sm -mt-3">
                  {fetcher.data.error}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-4">
              <p>
                Don’t have the Vehicle Identification Number (VIN) handy? Here’s
                where to find it.
              </p>

              <div className="relative flex gap-4 items-center">
                <CarFront
                  size={38}
                  strokeWidth={1.5}
                  absoluteStrokeWidth
                  className="text-muted-foreground shrink-0"
                />
                <div className="absolute top-[12px] left-[21px] size-2">
                  <div className="absolute size-full rounded-full bg-green-400 opacity-60 animate-slow-ping" />
                  <div className="absolute size-full rounded-full border border-background bg-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Driver side dashboard
                  </p>
                  <p className="text-sm">Just look through the windshield.</p>
                </div>
              </div>

              <div className="relative flex gap-4 items-center">
                <Car
                  size={38}
                  strokeWidth={1.5}
                  absoluteStrokeWidth
                  className="text-muted-foreground shrink-0 -scale-x-100"
                />
                <div className="absolute top-[22px] left-[15px] size-2">
                  <div className="absolute size-full rounded-full bg-green-400 opacity-60 animate-slow-ping" />
                  <div className="absolute size-full rounded-full border border-background bg-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Driver side door jamb
                  </p>
                  <p className="text-sm">
                    Look for a sticker with lots of numbers and letters.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button disabled={fetcher.state !== "idle"}>
                {fetcher.state !== "idle" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching your vehicle...
                  </>
                ) : (
                  "Add vehicle"
                )}
              </Button>
              <DrawerClose asChild>
                <Button className="w-full" variant="ghost">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </div>
        </fetcher.Form>
      </DrawerContent>
    </Drawer>
  );
};
