import { FC } from "react";
import { AppBar, Container, Toolbar } from "@mui/material";

export const NavBar: FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/*<Box sx={{ flexGrow: 1, display: "flex" }}>
            <Button
              component={RefLink}
              router={router}
              routeName="uploading"
              routeParams={{ uploading: "engines" }}
              sx={{ color: "white" }}
            >
              Двигатели
            </Button>
            <Button
              component={RefLink}
              router={router}
              routeName="uploading"
              routeParams={{ uploading: "transmissions" }}
              sx={{ color: "white" }}
            >
              АКПП / МКПП
            </Button>
          </Box>*/}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
