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
  useSearchParams,
} from "remix";

import { prisma } from "~/db.server";

enum FormNames {
  SEND_SALARY = "send_salary",
  FILTER = "filter",
}

export const sendSalaryAction = async (formData: FormData) => {
  console.log("mybug formData", Object.fromEntries(formData));
  const companie = formData.get("companie");
  const pozitie = formData.get("pozitie");
  const oras = formData.get("oras");
  const salariu = formData.get("salariu");
  const ani_experienta = formData.get("ani_experienta");
  const scutit_de_impozit = formData.get("scutit_de_impozit");
  const pfa = formData.get("pfa");

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
  console.log("FORMNAME", formName, formData);
  if (formName === FormNames.SEND_SALARY) {
    return sendSalaryAction(formData);
  } else if (formName === FormNames.FILTER) {
    console.log("INTRU PE REDIRECT", formData);
    const companie = formData.get("filtru_companie");
    const pozitie = formData.get("filtru_pozitie");
    const oras = formData.get("filtru_oras");
    return redirect(
      `/blocnotes?index&companie=${companie}&pozitie=${pozitie}&oras=${oras}`
    );
  }
  return sendSalaryAction(formData);
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const company = url.searchParams.get("companie");
  const city = url.searchParams.get("oras");

  return prisma.salariu.findMany({
    where: {
      AND: [
        { companie: { contains: company ?? undefined } },
        { oras: { contains: city ?? undefined } },
      ],
    },
  });
};

export default function BlocNotesIndexPage() {
  const salaries = useLoaderData() as Salariu[];
  const result = useActionData();
  const [searchParams] = useSearchParams();
  const filtruCompanie = searchParams.get("companie");
  const filtruPozitie = searchParams.get("pozitie");
  const filtruOras = searchParams.get("oras");
  const hasSearch = !!filtruCompanie || !!filtruPozitie || !!filtruOras;

  return (
    <div>
      <h1>CashIT</h1>

      <h6>Cauta</h6>
      <Form method="post">
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <label htmlFor="filtru_companie">
            Companie:{" "}
            <input id="filtru_companie" name="filtru_companie" type="text" />
          </label>

          <label htmlFor="filtru_pozitie">
            Pozitie:{" "}
            <input id="filtru_pozitie" name="filtru_pozitie" type="text" />
          </label>

          <label htmlFor="filtru_oras">
            Oras: <input id="filtru_oras" name="filtru_oras" type="text" />
          </label>
        </div>
        <button name="formName" value={FormNames.FILTER}>
          Cauta
        </button>
      </Form>

      {hasSearch && (
        <div>
          Ai cautat {filtruCompanie ? <>compania <b>{filtruCompanie}</b></> : null}{" "}
          {filtruPozitie ? <> pe pozitia <b>{filtruPozitie}</b></> : null}{" "}
          {filtruOras ? <> in orasul <b>{filtruOras}</b></> : null}
        </div>
      )}

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

      <h4>Adauga salariu</h4>
      <Form method="post">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="companie">
            Companie:{" "}
            <input id="companie" name="companie" type="text" required />
          </label>

          <label htmlFor="pozitie">
            Pozitie: <input id="pozitie" name="pozitie" type="text" required />
          </label>

          <label htmlFor="salariu">
            Salariu:{" "}
            <input id="salariu" name="salariu" type="number" required />
          </label>

          <label htmlFor="oras">
            Oras: <input id="oras" name="oras" type="text" required />
          </label>

          <label htmlFor="ani_experienta">
            Ani de experienta:{" "}
            <input
              id="ani_experienta"
              name="ani_experienta"
              type="number"
              required
            />
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

        <button name="formName" value={FormNames.SEND_SALARY}>
          Trimete
        </button>
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
