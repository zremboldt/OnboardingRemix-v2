import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Autocomplete } from "~/components/autocomplete";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { updateUser } from "~/models/user.server";
import { getUser, requireUser } from "~/session.server";
import { prefillRequest, useRootLoaderData } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json(user);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, accountId } = await requireUser(request);
  const formData = await request.formData();
  const address = formData.get("address");

  if (typeof address !== "string" || address.length === 0) {
    return json(
      { errors: { address: "Address is required" } },
      { status: 400 },
    );
  }

  await updateUser(id, "address", address);
  await prefillRequest({ accountId });

  return redirect(`/homeowner`);
};

export const meta: MetaFunction = () => [{ title: "Address | Root Insurance" }];

export default function AddressScene() {
  const { address } = useRootLoaderData() || {};
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <h2 className="text-3xl">What’s your home address?</h2>

      <Form method="post" className="flex flex-col gap-3">
        <Input
          name="address"
          defaultValue={address}
          placeholder="Address, city, state, ZIP"
        />
        {/* <Autocomplete /> */}

        {actionData?.errors?.address ? (
          <p className="text-destructive text-sm -mt-2">
            {actionData.errors.address}
          </p>
        ) : null}

        <Button type="submit">Continue</Button>
      </Form>
    </div>
  );
}
