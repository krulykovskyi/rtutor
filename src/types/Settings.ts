export type Settings = {
  id: number;
  name: string;
  value: string;
  componentType: "select" | "input" | "checkbox";
  possibleValues: string | null;
}[];
