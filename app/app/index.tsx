import { redirect } from "remix";
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ request, context }) => {
  return redirect("/app/today");
};
