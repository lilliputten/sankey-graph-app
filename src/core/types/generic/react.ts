export interface PropsWithClassName {
  className?: string;
}
export type PropsWithChildrenAndClassName = React.PropsWithChildren & PropsWithClassName;
