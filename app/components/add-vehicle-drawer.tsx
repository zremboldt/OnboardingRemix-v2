import { Car, CarFront, CirclePlus } from "lucide-react";

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
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="mr-2 h-4 w-4" /> Add vehicle
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto flex items-center sm:rounded-2xl sm:bottom-4 sm:after:hidden">
        <div className="flex flex-col gap-9 max-w-md mx-6 my-4 sm:my-8">
          <div className="flex flex-col gap-4">
            <DrawerTitle>What’s the VIN?</DrawerTitle>
            <Input placeholder="VIN" />
          </div>

          <div className="flex flex-col gap-4">
            <p>
              Don’t have the Vehicle Identification Number (VIN) handy? Here’s
              where to find it.
            </p>

            <div className="flex gap-4 items-center">
              <CarFront
                size={38}
                strokeWidth={1.5}
                absoluteStrokeWidth
                className="text-muted-foreground shrink-0"
              />
              <div className="">
                <p className="text-sm font-bold">Driver side dashboard</p>
                <p className="text-sm">Just look through the windshield.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Car
                size={38}
                strokeWidth={1.5}
                absoluteStrokeWidth
                className="text-muted-foreground shrink-0"
              />
              <div className="">
                <p className="text-sm font-bold">Driver side door jamb</p>
                <p className="text-sm">
                  Look for a sticker with lots of numbers and letters.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button>Add vehicle</Button>
            <DrawerClose asChild>
              <Button className="w-full" variant="ghost">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
