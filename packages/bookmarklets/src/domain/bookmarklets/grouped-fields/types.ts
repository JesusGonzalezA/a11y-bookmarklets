export interface GroupedFieldsData {
  selector: string;
  groupType: "fieldset" | "role-group" | "role-radiogroup" | "ungrouped";
  legend: string;
  controls: number;
  name: string;
}
