import Stack from "@mui/material/Stack";
import { Outlet } from "react-router-dom";

function NonAuthLayout() {
  return (
    <Stack alignItems="center" justifyContent={"center"} height={"100vh"}>
      <Outlet />
    </Stack>
  );
}

export default NonAuthLayout;
