import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { logout } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  console.log('mybug ACTION IS RUNNING dude logout now')
  return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/");
};
