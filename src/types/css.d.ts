declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.module.css" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classes: { [key: string]: string } | any;
  export default classes;
}
