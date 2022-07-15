import { Salariu } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { prisma } from "~/db.server";
import { getSession, getUserId, requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const toApprove = formData.get("approve");
  const toRemove = formData.get("remove");
  try {
    if (toApprove && typeof toApprove === "string" && parseInt(toApprove)) {
      await prisma.salariu.update({
        where: { id: parseInt(toApprove) },
        data: { aprobat: true },
      });
    }
    if (toRemove && typeof toRemove === "string" && parseInt(toRemove)) {
      await prisma.salariu.delete({ where: { id: parseInt(toRemove) } });
    }
  } catch {
    return "Failed";
  }
  return "";
};

interface LoaderData {
  salaries: Salariu[];
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  //   const x = await getUserId(request);
  //   console.log('session is', x)
  const userId = await requireUserId(request);
  console.log("mybug userid is", userId);
  //   const session = await getSession(request);
  //   console.log("session is", session.data);
  //   const user = session.get("userId");
  //   console.log('mybug user is', user)
  if (!userId)
    return {
      error: "Trebuie sa te loghezi sefule",
      salaries: [],
    };
  const salaries = await prisma.salariu.findMany({
    where: {
      AND: [{ aprobat: { equals: false } }],
    },
  });
  return { salaries };
};

export default function Admin() {
  const { salaries, error } = useLoaderData() as LoaderData;
  if (error) {
    return <div>Bossule nu esti logat ce cauti aici?</div>;
  }
  return (
    <>
      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
      <h3>De aprobat</h3>
      <Form method="post">
        <table>
          <tr>
            <th>Companie</th>
            <th>Pozitie</th>
            <th>Salariu</th>
            <th>Ani experienta</th>
            <th>Oras</th>
            <th>Scutire impozit</th>
            <th>PFA</th>
            <th>Aproba</th>
            <th>Sterge</th>
          </tr>
          <tbody>
            {salaries.map((salary) => {
              return (
                <tr key={salary.id}>
                  <td>{salary.companie}</td>
                  <td>{salary.pozitie}</td>
                  <td>{salary.salariu}</td>
                  <td>{salary.ani_experienta}</td>
                  <td>{salary.oras}</td>
                  <td>{salary.absolvent ? "✓" : "X"}</td>
                  <td>{salary.pfa ? "✓" : "X"}</td>
                  <td>
                    <button
                      name="approve"
                      value={salary.id}
                      style={{ backgroundColor: "green" }}
                    >
                      Aproba
                    </button>
                  </td>
                  <td>
                    <button
                      name="remove"
                      value={salary.id}
                      style={{ backgroundColor: "red" }}
                    >
                      Sterge
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Form>
      <div>Esti cel mai tare administrator bossule</div>
      <div>Cum administrezi tu nu administreaza nimenea</div>
      <div>TODO doua rute una pt aprobat alta pt editari stergeri etc</div>
    </>
  );
}
