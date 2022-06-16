import { FC, forwardRef } from "react";
import {
  Box,
  ButtonTypeMap,
  Divider,
  Drawer,
  ExtendButtonBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useRouter } from "react-router5";
import { BaseLinkProps } from "react-router5/dist/BaseLink";

interface IProps {
  categories: string[];
}

const RefLink = forwardRef<
  HTMLAnchorElement,
  ExtendButtonBase<ButtonTypeMap> & BaseLinkProps
>((props, _) => <Link {...props} />);

export const SideDrawer: FC<IProps> = ({ categories }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Box
      component="nav"
      sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="persistent"
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
        open={true}
      >
        <Toolbar />
        <Divider />
        <List>
          {categories.map((category) => (
            <ListItem key={category} disablePadding>
              <ListItemButton
                component={RefLink}
                router={router}
                routeName="uploading"
                routeParams={{ uploading: category }}
              >
                <ListItemText primary={t(`navLinks:${category}`)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
