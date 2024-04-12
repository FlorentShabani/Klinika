import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function PatientLayout() {
  return (
    <Fragment>
      <Sidebar user="patient">
        <main className="relative overflow-hidden">
          <Outlet />
        </main>
      </Sidebar>
      {/* TODO: Footer */}
    </Fragment>
  );
}
