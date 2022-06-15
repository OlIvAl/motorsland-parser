import { FC } from "react";
import { AppBar, Container, Toolbar } from "@mui/material";

/*const RefLink = forwardRef<
  HTMLAnchorElement,
  ExtendButtonBase<ButtonTypeMap> & BaseLinkProps
>((props, _) => <Link {...props} />);*/

export const NavBar: FC = () => {
  return (
    <AppBar position="sticky">
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
