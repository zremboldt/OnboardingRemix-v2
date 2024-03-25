import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Info } from "lucide-react";

import { Alert, AlertDescription } from "~/components/ui/alert";
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
  const hadRecentAccident = formData.get("hadRecentAccident");

  if (!hadRecentAccident) {
    return json(
      { errors: { hadRecentAccident: "Selection is required" } },
      { status: 400 },
    );
  }

  const accidentBoolean = hadRecentAccident === "true" ? true : false;

  await updateUser(userId, "hadRecentAccident", accidentBoolean);

  return redirect(`/profile-review`);
};

export const meta: MetaFunction = () => [
  { title: "Recent accident | Root Insurance" },
];

export default function RecentAccidentScene() {
  const { hadRecentAccident } = useRootLoaderData() || {};
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="flex flex-col gap-8 w-full max-w-md">
      <h2 className="text-3xl">
        In the past 3 years, have you or any other drivers on your policy been
        in an accident or gotten a ticket?
      </h2>

      <RadioGroup
        name="hadRecentAccident"
        defaultValue={hadRecentAccident?.toString()}
      >
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
        {actionData?.errors?.hadRecentAccident ? (
          <p className="text-destructive text-sm">
            {actionData.errors.hadRecentAccident}
          </p>
        ) : null}
      </RadioGroup>

      <Button type="submit" className="w-full">
        Continue
      </Button>

      <Alert className="text-muted-foreground">
        <Info className="h-4 w-4" />
        <AlertDescription>
          We’ll use this information to estimate your quote. Before you buy a
          policy with Root, we’ll verify your driving record.
        </AlertDescription>
      </Alert>
    </Form>
  );
}
