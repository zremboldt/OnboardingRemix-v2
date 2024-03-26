import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createAccount } from "~/models/account.server";
import { createUser, updateUser } from "~/models/user.server";
import { createUserSession, getSession, getUser } from "~/session.server";
import { safeRedirect, useRootLoaderData } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json(user);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request);
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dob");
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

  // if user already has an active session, update their name instead of creating a new user
  if (session.has("userId")) {
    const id = session.get("userId");
    console.log(id);
    await updateUser(id, "firstName", firstName);
    await updateUser(id, "lastName", lastName);
    return redirect("/dob");
  }

  const account = await createAccount();
  const user = await createUser({
    firstName,
    lastName,
    accountId: account.id,
    pni: true,
  });

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Name | Root Insurance" }];

export default function NameScene() {
  const { firstName, lastName } = useRootLoaderData() || {};
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <h1 className="text-4xl lg:text-5xl">
        Get a quote in less than 5 minutes
      </h1>

      <div className="w-16 h-1 bg-primary"></div>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl">Let’s start with your name</h2>
        <p>Please make sure it matches the information on your license.</p>
      </div>

      <Form method="post" className="flex flex-col gap-3">
        <Input
          name="firstName"
          defaultValue={firstName}
          placeholder="First name"
        />

        {actionData?.errors?.firstName ? (
          <p className="text-destructive text-sm -mt-2">
            {actionData.errors.firstName}
          </p>
        ) : null}

        <Input
          name="lastName"
          defaultValue={lastName}
          placeholder="Last name"
        />

        {actionData?.errors?.lastName ? (
          <p className="text-destructive text-sm -mt-2">
            {actionData.errors.lastName}
          </p>
        ) : null}

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </Form>

      <p className="text-center">
        Been here before?{" "}
        <Link
          to="/sign-in"
          className="no-underline outline-none text-foreground transition hover:text-primary focus-visible:text-primary"
        >
          Finish signing up
        </Link>
      </p>
    </div>
  );
}
