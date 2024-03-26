import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return redirect(`/end`);
  } else {
    return json(
      { errors: { email: "No user with this email exists" } },
      { status: 400 },
    );
  }
};

export const meta: MetaFunction = () => [
  { title: "Create login | Root Insurance" },
];

export default function SignInScene() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-pretty">Welcome back.</h2>
        <p>What’s your email address? We’ll pick up where you left off.</p>
      </div>

      <Form method="post" className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
        />

        {actionData?.errors?.email ? (
          <p className="text-destructive text-sm -mt-2">
            {actionData.errors.email}
          </p>
        ) : null}

        <Button type="submit">Continue</Button>
      </Form>
    </div>
  );
}
