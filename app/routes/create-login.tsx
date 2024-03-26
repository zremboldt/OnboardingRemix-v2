import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  createUserPassword,
  getUserByEmail,
  updateUser,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { validateEmail } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user with this email already exists",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const userId = await requireUserId(request);

  await updateUser(userId, "email", email);
  await createUserPassword(userId, password);

  return redirect(`/end`);
};

export const meta: MetaFunction = () => [
  { title: "Create login | Root Insurance" },
];

export default function CreateLoginScene() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-pretty">
          Create an account to save your progress.
        </h2>
        <p>We’ll use your account to save your quote.</p>
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

        <Input
          name="password"
          type="password"
          placeholder="Create a strong password (at least 8 characters)"
        />

        {actionData?.errors?.password ? (
          <p className="text-destructive text-sm -mt-2">
            {actionData.errors.password}
          </p>
        ) : null}

        <Button type="submit">Continue</Button>
      </Form>
    </div>
  );
}
