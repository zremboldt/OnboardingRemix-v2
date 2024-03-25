import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Car, Info } from "lucide-react";
import { FunctionComponent, useState } from "react";

import { AddVehicleDrawer } from "~/components/add-vehicle-drawer";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { getVehicleListItems, updateVehicle } from "~/models/vehicle.server";
import { requireUser } from "~/session.server";
import { useRootLoaderData, createRandomVehicle } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { accountId } = await requireUser(request);
  const vehicles = await getVehicleListItems({ accountId });

  return json({ vehicles });
};

export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.clone().formData();
  const _action = formData.get("_action");

  if (_action === "TOGGLE_VEHICLE") {
    return toggleVehicle(args);
  }

  if (_action === "ADD_VEHICLE") {
    return addVehicle(args);
  }

  throw new Error("Unknown action");
}

async function toggleVehicle({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const vehicleId = formData.get("vehicleId");
  const includedOnPolicy = formData.get("includedOnPolicy") === "true";

  if (typeof vehicleId !== "string") {
    return json(
      { errors: { vehicleId: "Vehicle ID is required" } },
      { status: 400 },
    );
  }

  return updateVehicle(vehicleId, "includedOnPolicy", includedOnPolicy);
}

async function addVehicle({ request }: ActionFunctionArgs) {
  const { accountId } = await requireUser(request);
  const formData = await request.formData();
  const vin = formData.get("vin");

  if (typeof vin !== "string" || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return json({ error: "Please enter a valid VIN" }, { status: 400 });
  }

  await createRandomVehicle({ accountId, vin });

  return json({ ok: true, error: null });
}

export const meta: MetaFunction = () => [
  { title: "Add Vehicles | Root Insurance" },
];

export default function WhichVehiclesScene() {
  const { vehicles } = useRootLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-pretty">
          Which vehicles do you want to insure?
        </h2>
        <p className="text-pretty">
          Need to add another vehicle? No worries, you can add more later.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {vehicles.length
          ? vehicles.map((vehicle) => (
              <VehicleToggleCard key={vehicle.id} vehicle={vehicle} />
            ))
          : null}

        <AddVehicleDrawer />

        <Button onClick={() => navigate(`/which-drivers`)} className="w-full">
          Continue
        </Button>
      </div>

      <Alert className="text-muted-foreground">
        <Info className="h-4 w-4" />
        <AlertDescription>
          We pulled this information from public records. If there’s information
          that you don’t recognize, you can ignore it–it won’t affect your
          account.
        </AlertDescription>
      </Alert>
    </div>
  );
}

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

  const [isChecked, setIsChecked] = useState(includedOnPolicy);

  return (
    <label
      className=" flex items-center space-x-4 rounded-md border p-4 bg-background"
      key={vehicle.id}
      htmlFor={vehicle.id}
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
      <fetcher.Form method="post">
        <input type="hidden" name="_action" value="TOGGLE_VEHICLE" />
        <input type="hidden" name="vehicleId" value={vehicle.id} />
        <Switch
          id={vehicle.id}
          type="submit"
          name="includedOnPolicy"
          value={includedOnPolicy ? "false" : "true"}
          checked={isChecked}
          onCheckedChange={() => setIsChecked(!isChecked)}
        />
      </fetcher.Form>
    </label>
  );
};
