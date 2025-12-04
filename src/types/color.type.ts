type NamedColor =
  | "black"
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "cyan"
  | "magenta"
  | "gray"
  | "grey"
  | "orange"
  | "pink"
  | "purple"
  | "brown"
  | "lime"
  | "olive"
  | "navy"
  | "teal"
  | "maroon"
  | "silver"
  | "gold"
  | "indigo"
  | "violet";

type HexColor = `#${string}`; // loose, can be improved with runtime check

type RgbColor = `rgb(${number},${number},${number})`;

type RgbaColor = `rgba(${number},${number},${number},${
  | number
  | `${number}.${number}`})`;

export type Color = NamedColor | HexColor | RgbColor | RgbaColor;
export type colorHandler = (rowData: object) => Color;
