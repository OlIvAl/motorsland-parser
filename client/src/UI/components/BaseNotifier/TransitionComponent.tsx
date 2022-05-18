import { createElement, FC, PropsWithChildren, ReactElement } from "react";
import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

export const TransitionComponent: FC<
  PropsWithChildren<TransitionProps & { children?: ReactElement<any, any> }>
> = (props) => createElement(Slide, { ...(props as any) });
