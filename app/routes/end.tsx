import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import devicesImage from "~/assets/devices@2x.png";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { updateUser } from "~/models/user.server";
import { requireUser } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id } = await requireUser(request);
  const formData = await request.formData();
  const phone = formData.get("phone");

  if (typeof phone !== "string" || phone.length === 0) {
    return json(
      { errors: { phone: "Please enter a valid phone number" } },
      { status: 400 },
    );
  }

  await updateUser(id, "phone", phone);

  return "success";
};

export const meta: MetaFunction = () => [
  { title: "Get the app | Root Insurance" },
];

export default function EndScene() {
  const fetcher = useFetcher();
  const data = fetcher.data;
  const success = data === "success";

  useEffect(() => {
    if (success) {
      window.open("raycast://extensions/raycast/raycast/confetti");
    }
  }, [success]);

  return (
    <div className="self-start flex items-center w-full max-w-4xl">
      <img
        src={devicesImage}
        alt="Phones displaying the Root app"
        className="hidden sm:block sm:max-w-72 md:max-w-sm"
      />
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl lg:text-5xl">
          Download the Root app to continue
        </h1>
        <p className="text-pretty">
          Thanks for completing your profile. Now it’s time to download the app,
          take the test drive, and determine your rate.
        </p>

        <fetcher.Form method="post" className="flex gap-3">
          <Input name="phone" type="tel" placeholder="Phone number" />
          <Button
            type="submit"
            style={{ minWidth: 130 }}
            disabled={success ? true : false}
          >
            {success ? "Sent!" : "Text me a link"}
          </Button>
        </fetcher.Form>
        {data?.errors?.phone ? (
          <p className="text-destructive text-sm -mt-4">{data.errors.phone}</p>
        ) : null}
      </div>
    </div>
  );
}
