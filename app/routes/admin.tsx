import { Salariu } from "@prisma/client";
import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import { prisma } from "~/db.server";

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

export const loader: LoaderFunction = async ({ request }) => {
  return await prisma.salariu.findMany({
    where: {
      AND: [{ aprobat: { equals: false } }],
    },
  });
};

export default function Admin() {
  const salaries = useLoaderData() as Salariu[];
  return (
    <>
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
                    <button name="approve" value={salary.id} style={{ backgroundColor: 'green'}}>
                      Aproba
                    </button>
                  </td>
                  <td>
                    <button name="remove" value={salary.id} style={{ backgroundColor: 'red'}}>
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
