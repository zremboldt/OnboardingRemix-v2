import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Car, ChevronRight, Info, MessageSquareText, User } from "lucide-react";
import { FunctionComponent, useState } from "react";

import { AddDriverDrawer } from "~/components/add-driver-drawer";
import { AddVehicleDrawer } from "~/components/add-vehicle-drawer";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  createUser,
  getUsersOnAccount,
  updateUser,
} from "~/models/user.server";
import { getVehicleListItems } from "~/models/vehicle.server";
import { requireUser } from "~/session.server";
import { useRootLoaderData } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pni = await requireUser(request);
  const vehicles = await getVehicleListItems({ accountId: pni.accountId });
  const users = await getUsersOnAccount({ accountId: pni.accountId });

  if (!users.length) {
    throw new Response("Not Found", { status: 404 });
  }

  const nextRoute = !pni.email ? "/create-login" : "/end";

  return json({ users, vehicles, nextRoute });
};

export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.clone().formData();
  const _action = formData.get("_action");

  if (_action === "TOGGLE_DRIVER") {
    return toggleDriver(args);
  }

  if (_action === "ADD_DRIVER") {
    return addDriver(args);
  }

  throw new Error("Unknown action");
}

async function toggleDriver({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = formData.get("userId");
  const includedOnPolicy = formData.get("includedOnPolicy") === "true";

  if (typeof userId !== "string") {
    return json({ errors: { userId: "userId is required" } }, { status: 400 });
  }

  return updateUser(userId, "includedOnPolicy", includedOnPolicy);
}

async function addDriver({ request }: ActionFunctionArgs) {
  const { accountId } = await requireUser(request);
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { errors: { firstName: "First name is required", lastName: null } },
      { status: 400 },
    );
  }

  if (typeof lastName !== "string" || lastName.length === 0) {
    return json(
      { errors: { firstName: null, lastName: "Last name is required" } },
      { status: 400 },
    );
  }

  await createUser({
    firstName,
    lastName,
    accountId,
    pni: false,
  });

  return json({ ok: true, error: null });
}

export const meta: MetaFunction = () => [{ title: "Review | Root Insurance" }];

export default function ProfileReviewScene() {
  const { vehicles, users, nextRoute } = useRootLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 w-full max-w-md">
      <h2 className="text-3xl text-pretty">How does your profile look?</h2>
      <div className="flex items-center py-4 px-6 space-x-6 rounded-md border bg-background shadow-xl -mt-6">
        <MessageSquareText
          size={34}
          strokeWidth={2}
          absoluteStrokeWidth
          className="text-primary"
        />
        <div className="flex-1 space-y-1">
          <p className="text-xs font-semibold text-primary">GOOD TO KNOW</p>
          <p className="text-sm font-semibold text-foreground">
            Our app gives drivers like you discounts based on how you drive.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Covered drivers</h3>
        {users
          .filter(({ includedOnPolicy }) => includedOnPolicy === true)
          .map((user) => (
            <UserToggleCard key={user.id} user={user} />
          ))}

        <AddDriverDrawer />
      </div>

      <div className="flex flex-col gap-3">
        <h3>Vehicles</h3>
        {vehicles.length
          ? vehicles
              .filter(({ includedOnPolicy }) => includedOnPolicy === true)
              .map((vehicle) => (
                <VehicleToggleCard key={vehicle.id} vehicle={vehicle} />
              ))
          : null}

        <AddVehicleDrawer />
      </div>

      <Button onClick={() => navigate(nextRoute)} className="w-full">
        Continue
      </Button>
    </div>
  );
}

const UserToggleCard: FunctionComponent<{
  user: {
    id: string;
    firstName: string;
    lastName: string;
    pni: boolean;
    includedOnPolicy: boolean;
  };
}> = ({ user }) => {
  const fetcher = useFetcher();

  const includedOnPolicy = fetcher.formData
    ? fetcher.formData.get("includedOnPolicy") === "true"
    : user.includedOnPolicy;

  return (
    <button
      className="group flex items-center text-start space-x-4 rounded-md border p-4 bg-background outline-none transition-all hover:bg-accent focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/30"
      key={user.id}
    >
      <User />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none text-foreground">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-muted-foreground">
          {includedOnPolicy ? "Covered" : "Not covered"}
        </p>
      </div>
      <ChevronRight className="transition group-focus:translate-x-1 group-hover:translate-x-1" />
    </button>
  );
};

const VehicleToggleCard: FunctionComponent<{
  vehicle: {
    id: string;
    year: number;
    make: string;
    model: string;
    includedOnPolicy: boolean;
  };
}> = ({ vehicle }) => {
  const fetcher = useFetcher();

  const includedOnPolicy = fetcher.formData
    ? fetcher.formData.get("includedOnPolicy") === "true"
    : vehicle.includedOnPolicy;

  return (
    <button
      className="group flex items-center text-start space-x-4 rounded-md border p-4 bg-background outline-none transition-all hover:bg-accent focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/30"
      key={vehicle.id}
    >
      <Car />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none text-foreground">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </p>
        <p className="text-sm text-muted-foreground">
          {includedOnPolicy ? "Added" : "Not added"}
        </p>
      </div>
      <ChevronRight className="transition group-focus:translate-x-1 group-hover:translate-x-1" />
    </button>
  );
};
