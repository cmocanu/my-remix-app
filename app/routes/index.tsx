import { Link, Outlet } from "remix";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main>
      <div>Le-am dat la dujmani idei sa-si ia pantofi ca ai mei</div>
      <div>routes/index.js</div>
      <Link to="/blocnotes">Blocnotes</Link>
      {/* <Outlet /> */}
    </main>
  )
}
