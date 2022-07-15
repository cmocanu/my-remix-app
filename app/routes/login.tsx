import * as React from "react";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Form,
  useActionData,
} from "remix";

import { createUserSession } from "~/session.server";


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (username !== "mocanu" || password !== "barosanu")
    return {
      error: "Nu ai ce sa cauti aici!",
    };

  // return json({ email, password });
  return await createUserSession({
    request,
    userId: username,
    remember: true,
    redirectTo: "/admin",
  });
};

export default function MyLogin() {
  const actionData = useActionData();
  // const { email, password } = actionData
  return (
    <div>
      <div style={{ color: "red" }}>{actionData?.error}</div>
      <Form method="post">
        <label htmlFor="username">
          User: <input id="username" name="username" type="text" />
        </label>

        <label htmlFor="password">
          Parola: <input id="password" name="password" type="password" />
        </label>

        <button name="formName" value={"FormNames.FILTER"}>
          Trimete
        </button>
      </Form>
    </div>
  );
}
