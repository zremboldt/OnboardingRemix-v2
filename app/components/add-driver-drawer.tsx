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

export const AddDriverDrawer = () => {
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
          <CirclePlus className="mr-2 h-4 w-4" /> Add driver
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto flex items-center sm:rounded-2xl sm:bottom-4 sm:after:hidden">
        <fetcher.Form method="post" className="w-full max-w-md m-4 sm:my-8">
          <input type="hidden" name="_action" value="ADD_DRIVER" />
          <div className="flex flex-col gap-3">
            <DrawerTitle>What’s their name?</DrawerTitle>
            <Input name="firstName" placeholder="First name" />

            {fetcher.state === "idle" && fetcher.data?.errors?.firstName ? (
              <p className="text-destructive text-sm -mt-3">
                {fetcher.data.errors.firstName}
              </p>
            ) : null}

            <Input name="lastName" placeholder="Last name" />

            {fetcher.state === "idle" && fetcher.data?.errors?.lastName ? (
              <p className="text-destructive text-sm -mt-3">
                {fetcher.data.errors.lastName}
              </p>
            ) : null}

            <div className="flex flex-col gap-3">
              <Button>Add driver</Button>
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
