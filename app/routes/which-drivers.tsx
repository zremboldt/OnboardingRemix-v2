import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Info, User } from "lucide-react";
import { FunctionComponent, useState } from "react";

import { AddDriverDrawer } from "~/components/add-driver-drawer";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  createUser,
  getUsersOnAccount,
  updateUser,
} from "~/models/user.server";
import { requireUser } from "~/session.server";
import { useRootLoaderData } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { accountId } = await requireUser(request);
  const users = await getUsersOnAccount({ accountId });
  if (!users.length) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ users });
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

export const meta: MetaFunction = () => [
  { title: "Add Drivers | Root Insurance" },
];

export default function WhichDriversScene() {
  const { users } = useRootLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight text-pretty">
          Which drivers will be covered on your policy?
        </h2>
        <p>
          All household members with a valid driver’s license, and other regular
          operators of the insured vehicle(s), must be listed on your policy.
        </p>
        <p>
          Household members with a valid driver’s license will only be covered
          if they are listed.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <UserToggleCard key={user.id} user={user} />
        ))}

        <AddDriverDrawer />

        <Button onClick={() => navigate(`/recent-accident`)} className="w-full">
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

  const [isChecked, setIsChecked] = useState(includedOnPolicy);

  return (
    <label
      className=" flex items-center space-x-4 rounded-md border p-4 bg-background"
      key={user.id}
      htmlFor={user.id}
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
      {user.pni ? null : (
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="TOGGLE_DRIVER" />
          <input type="hidden" name="userId" value={user.id} />
          <Switch
            id={user.id}
            type="submit"
            name="includedOnPolicy"
            value={includedOnPolicy ? "false" : "true"}
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
          />
        </fetcher.Form>
      )}
    </label>
  );
};
