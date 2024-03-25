import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { updateUser } from "~/models/user.server";
import { getUser, requireUserId } from "~/session.server";
import { useRootLoaderData } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json(user);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const maritalStatus = formData.get("marital-status");

  if (typeof maritalStatus !== "string") {
    return json(
      { errors: { maritalStatus: "Selection is required" } },
      { status: 400 },
    );
  }

  await updateUser(userId, "maritalStatus", maritalStatus);

  return redirect(`/which-vehicles`);
};

export const meta: MetaFunction = () => [
  { title: "Marital Status | Root Insurance" },
];

export default function MaritalStatusScene() {
  const { maritalStatus } = useRootLoaderData();
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="flex flex-col gap-8 w-full max-w-md">
      <h2 className="text-3xl">What’s your marital status?</h2>

      <RadioGroup
        name="marital-status"
        defaultValue={maritalStatus?.toString()}
      >
        <Separator />
        {["Single", "Married", "Widowed"].map((status) => (
          <div key={status}>
            <Label className="flex items-center justify-between py-5 px-3">
              {status}
              <RadioGroupItem value={status.toLowerCase()} />
            </Label>
            <Separator />
          </div>
        ))}
        {actionData?.errors?.maritalStatus ? (
          <p className="text-destructive text-sm">
            {actionData.errors.maritalStatus}
          </p>
        ) : null}
      </RadioGroup>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </Form>
  );
}
