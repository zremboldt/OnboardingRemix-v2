import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { updateUser } from "~/models/user.server";
import { requireUser, requireUserId } from "~/session.server";
import { useRootLoaderData } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { dob } = await requireUser(request);
  if (!dob) {
    return null;
  }

  const date = new Date(dob);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return json({ month, day, year });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const dobString = formData.get("dob");

  if (typeof dobString !== "string" || dobString?.length !== 8) {
    return json({ errors: { dob: "This date is invalid" } }, { status: 400 });
  }

  const month = dobString.slice(0, 2);
  const day = dobString.slice(2, 4);
  const year = dobString.slice(4, 8);

  const dob = new Date(`${year}-${month}-${day}`);

  if (isNaN(dob.getTime())) {
    return json({ errors: { dob: "This date is invalid" } }, { status: 400 });
  }

  // ensure user is at least 18
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  if (dob.getTime() > eighteenYearsAgo.getTime()) {
    return json(
      { errors: { dob: "You must be at least 18 years old" } },
      { status: 400 },
    );
  }

  await updateUser(userId, "dob", dob);

  return redirect(`/address`);
};

export const meta: MetaFunction = () => [
  { title: "Birthday | Root Insurance" },
];

export default function NameScene() {
  const { month, day, year } = useRootLoaderData() || {};
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <h2 className="text-3xl">When’s your birthday?</h2>

      <Form method="post" className="flex flex-col gap-3 relative">
        <Badge
          variant="outline"
          className="text-muted-foreground bg-background absolute z-20 -top-4 right-2"
        >
          MM-DD-YYYY
        </Badge>
        <InputOTP maxLength={8} name="dob">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup className="flex-[2]">
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>

        {actionData?.errors?.dob ? (
          <p className="text-destructive text-sm -mt-2">
            {actionData.errors.dob}
          </p>
        ) : null}

        <Button type="submit">Continue</Button>
      </Form>
    </div>
  );
}
