import { Fragment } from "react";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <Fragment>
      {/* TODO: Header */}
      <main>
        <Outlet />
        {/* <Background /> */}
      </main>
      {/* TODO: Footer */}
    </Fragment>
  );
}