import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ margin: 0, padding: 0 }}>
        <Outlet />
      </main>
    </>
  );
}
