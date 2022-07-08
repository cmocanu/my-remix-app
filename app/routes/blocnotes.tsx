import { json, Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { useOptionalUser } from "~/utils";

// type LoaderData = {
//   blocnotes: Awaited<ReturnType<typeof getNoteListItems>>;
// };
type LoaderData = {
  blocnotes: { title: string; subtitle: string }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  // const userId = await requireUserId(request);
  // const noteListItems = await getNoteListItems({ userId });
  const blocnotes = [
    { title: "un blocnotes", subtitle: "Este primu blocnotes boss" },
    { title: "doi blocnotes", subtitle: "Este al doilea blocnotes, the best blocnotes yet!" },
  ];
  return json<LoaderData>({ blocnotes });
};

export default function Index() {
  const data = useLoaderData() as LoaderData;
  const user = useOptionalUser();
  return (
    <main>
      {/* <div>Acesta este un blocnotes</div>
      {data.blocnotes.map(d => <div key={d.title}>{d.title}</div>)} */}
      <Outlet />
    </main>
  );
}
