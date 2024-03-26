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
  const homeowner = formData.get("homeowner");
  console.log(homeowner);

  if (!homeowner) {
    return json(
      { errors: { homeowner: "Selection is required" } },
      { status: 400 },
    );
  }

  const isHomeowner = homeowner === "true" ? true : false;

  await updateUser(userId, "homeowner", isHomeowner);

  return redirect(`/recently-moved`);
};

export const meta: MetaFunction = () => [
  { title: "Homeowner | Root Insurance" },
];

export default function HomeownerScene() {
  const { homeowner } = useRootLoaderData() || {};
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="flex flex-col gap-8 w-full max-w-md">
      <h2 className="text-3xl">Do you rent or own your home?</h2>

      <RadioGroup name="homeowner" defaultValue={homeowner?.toString()}>
        <Separator />
        <Label className="flex items-center justify-between py-5 px-3">
          Rent
          <RadioGroupItem value="false" />
        </Label>
        <Separator />
        <Label className="flex items-center justify-between py-5 px-3">
          Own
          <RadioGroupItem value="true" />
        </Label>
        <Separator />
        {actionData?.errors?.homeowner ? (
          <p className="text-destructive text-sm">
            {actionData.errors.homeowner}
          </p>
        ) : null}
      </RadioGroup>

      <Button type="submit">Continue</Button>
    </Form>
  );
}
