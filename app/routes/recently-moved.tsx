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
  const recentlyMoved = formData.get("recentlyMoved");

  if (!recentlyMoved) {
    return json(
      { errors: { recentlyMoved: "Selection is required" } },
      { status: 400 },
    );
  }

  const hasRecentlyMoved = recentlyMoved === "true" ? true : false;

  await updateUser(userId, "recentlyMoved", hasRecentlyMoved);

  return redirect(`/marital-status`);
};

export const meta: MetaFunction = () => [
  { title: "Recently moved | Root Insurance" },
];

export default function RecentlyMovedScene() {
  const { recentlyMoved } = useRootLoaderData() || {};
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="flex flex-col gap-8 w-full max-w-md">
      <h2 className="text-3xl font-semibold tracking-tight">
        Have you moved in the last 6 months?
      </h2>

      <RadioGroup name="recentlyMoved" defaultValue={recentlyMoved?.toString()}>
        <Separator />
        <Label className="flex items-center justify-between py-5 px-3">
          Yes
          <RadioGroupItem value="true" />
        </Label>
        <Separator />
        <Label className="flex items-center justify-between py-5 px-3">
          No
          <RadioGroupItem value="false" />
        </Label>
        <Separator />
        {actionData?.errors?.recentlyMoved ? (
          <p className="text-destructive text-sm">
            {actionData.errors.recentlyMoved}
          </p>
        ) : null}
      </RadioGroup>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </Form>
  );
}
