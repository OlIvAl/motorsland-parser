import { FC, forwardRef } from "react";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { Link, useRouter } from "react-router5";
import { BaseLinkProps } from "react-router5/dist/BaseLink";
import { ExtendButtonBase } from "@mui/material/ButtonBase";
import { ButtonTypeMap } from "@mui/material/Button/Button";

const RefLink = forwardRef<
  HTMLAnchorElement,
  ExtendButtonBase<ButtonTypeMap> & BaseLinkProps
>((props, _) => <Link {...props} />);

export const NavBar: FC = () => {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Button
              component={RefLink}
              router={router}
              routeName="engines"
              sx={{ color: "white" }}
            >
              Двигатели
            </Button>
            <Button
              component={RefLink}
              router={router}
              routeName="transmissions"
              sx={{ color: "white" }}
            >
              АКПП / МКПП
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
