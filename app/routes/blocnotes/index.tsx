import { Salariu } from "@prisma/client";
import { useState } from "react";
import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";

import { prisma } from "~/db.server";

enum FormNames {
  SEND_SALARY = "send_salary",
  FILTER = "filter",
}

export const sendSalaryAction = async (formData: FormData) => {
  // const formData = await request.formData();
  console.log("mybug formData", Object.fromEntries(formData));
  const companie = formData.get("companie");
  const pozitie = formData.get("pozitie");
  const oras = formData.get("oras");
  const salariu = formData.get("salariu");
  const ani_experienta = formData.get("ani_experienta");
  const scutit_de_impozit = formData.get("scutit_de_impozit");
  const pfa = formData.get("pfa");

  // const data = Object.fromEntries(await request.formData());

  //   const formErrors = {
  //     name: validateName(data.companie),
  //     email: validateName(data.pozitie),
  //     password: validateName(data.oras),
  //     confirmPassword: validateName(data.password),
  //   };

  //   if (
  //     typeof companie !== "string" ||
  //     typeof pozitie !== "string" ||
  //     typeof oras !== "string" ||
  //     typeof scutit_de_impozit !== "string" ||
  //     typeof pfa !== "string" ||
  //     typeof salariu !== "string"
  //   ) {
  //     return json({ errors: "Invalid" }, { status: 400 });
  //   }

  try {
    await prisma.salariu.create({
      data: {
        companie: companie as string,
        pozitie: pozitie as string,
        salariu: parseInt(salariu as string),
        ani_experienta: parseInt(ani_experienta as string),
        cuvinte_cheie: "",
        data: new Date(),
        oras: oras as string,
        pfa: !!pfa,
        absolvent: !!scutit_de_impozit,
      },
    });
  } catch {
    return { error: "Nu am reusit sa trimet; te rog verifica datele" };
  }
  return { success: true };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const formName = formData.get("formName");
  if (formName === FormNames.SEND_SALARY) {
    return sendSalaryAction(formData);
  }
  return sendSalaryAction(formData);
  // sendSalaryAction
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const company = url.searchParams.get("companie");
  const city = url.searchParams.get("oras");
  // const term = url.searchParams.get("companie");

  // where: {
  //   AND: [
  //     { price: 21.99 },
  //     { filters: { some: { name: 'ram', value: '8GB' } } },
  //     { filters: { some: { name: 'storage', value: '256GB' } } },
  //   ],
  // },

  console.log("mybug companie", company);
  // if (!company) return prisma.salariu.findMany({ take: 5 });
  return prisma.salariu.findMany({
    where: {
      AND: [
        { companie: { contains: company ?? undefined } },
        { oras: { contains: city ?? undefined } },
      ],
    },
  });
  // return prisma.salariu.findMany({
  //   take: 5,
  //   where: { companie: { contains: company } },
  // });
  // return salaries;
};

export default function BlocNotesIndexPage() {
  const salaries = useLoaderData() as Salariu[];
  const result = useActionData();

  return (
    <div>
      <h1>CashIT</h1>

      <table>
        <tr>
          <th>Companie</th>
          <th>Pozitie</th>
          <th>Salariu</th>
          <th>Ani experienta</th>
          <th>Oras</th>
          <th>Scutire impozit</th>
          <th>PFA</th>
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
              </tr>
            );
          })}
        </tbody>
      </table>

      <Form method="post">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="companie">
            Companie: <input id="companie" name="companie" type="text" />
          </label>

          <label htmlFor="pozitie">
            Pozitie: <input id="pozitie" name="pozitie" type="text" />
          </label>

          <label htmlFor="salariu">
            Salariu: <input id="salariu" name="salariu" type="number" />
          </label>

          <label htmlFor="oras">
            Oras:{" "}
            <input
              id="oras"
              name="oras"
              type="text"
              // aria-invalid={true}
              // aria-describedby="ce plm de oras e asta??!"
              required
            />
          </label>

          <label htmlFor="ani_experienta">
            Ani de experienta:{" "}
            <input id="ani_experienta" name="ani_experienta" type="number" />
          </label>

          <label htmlFor="scutit_de_impozit">
            Scutit de impozit:{" "}
            <input
              id="scutit_de_impozit"
              name="scutit_de_impozit"
              type="checkbox"
            />
          </label>

          <label htmlFor="pfa">
            PFA / SRL: <input id="pfa" name="pfa" type="checkbox" />
          </label>
        </div>

        {result?.error ? (
          <div style={{ color: "red" }}>{result.error}</div>
        ) : null}

        {result?.success ? (
          <div style={{ color: "green" }}>
            Rezultatul a fost inregistrat si va fi afisat dupa validare
          </div>
        ) : null}

        <button>Trimete</button>
      </Form>
      <p>
        Nu ai selectat niciun blocnotes{" "}
        <Link to="new" className="text-blue-500 underline">
          create a new note.
        </Link>
      </p>
    </div>
  );
}
