import * as React from "react";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Form,
  Link,
  redirect,
  useSearchParams,
  json,
  useActionData,
} from "remix";

import { getUserId, createUserSession } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";

import { Button } from "~/components";
import Logo from "~/images/logo.svg";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="flex h-full items-baseline justify-center">
      <div className="mt-5 w-full max-w-md flex-none rounded border bg-white p-3 shadow sm:mt-12">
        <div className="w-28">
          <img src={Logo} alt="Logo" className="w-full" />
        </div>

        <Form method="post" className="mt-4 space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <h2 className="text-2xl font-bold">Sign Up</h2>
          </div>

          <div>
            <label className="flex flex-col space-y-4 text-sm font-semibold">
              <span>Email</span>
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-400 px-2 py-1 text-lg"
              />
            </label>
            {actionData?.errors?.email && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="flex flex-col space-y-4 text-sm font-semibold">
              <span>Password</span>
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </label>
            {actionData?.errors?.password && (
              <div className="text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>

          <Button type="submit">Sign Up</Button>

          <div className="text-center text-sm text-gray-500">
            Already signed up?{" "}
            <Link
              className="text-red-600"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Go to login
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
}
