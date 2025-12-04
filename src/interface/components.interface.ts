export  enum ComponentName {
  INPUT = "input",
  DATE_PICKER = "date-picker",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO_BUTTON = "radio-button",
  BUTTON = "button",
  BUTTON_DELETE = "delete",
  BUTTON_VIEW = "view",
  BUTTON_EDIT = "edit",
  TABLE = "table",
}

export interface IInputComponent {
  component: ComponentName.INPUT;
  type: "text" | "password" | "email" | "number"; // (default => text)
  disable: boolean;
  mask?: string; // ###,###
  fillMask?: boolean;
  unmaskedValue?: boolean;
  key: string; // username,
  placeholder?: string; // نام کاربری را وارد نمایید,
  label?: string; // نام کاربری
}
export interface IDatePickerComponent {
  component: ComponentName.DATE_PICKER;
  label?: string;
  placeholder?: string | undefined;
  name: string;
  key: string;
}

export interface ISelectComponent {
  component: ComponentName.SELECT;
  name: string;
  filled: boolean;
  options: string[]; // if !filter-service // [ "pending", "active", "disabled" ] },
  unmaskedValue?: boolean;
  key: "string"; // username,
  placeholder: "filter-services"; // 'promise<function>',
  "option-label": string; // if filter-service' // label,
  "option-value": string; // if filter-service // value,
  multiple?: boolean;
  useChips?: boolean; // if multiple,
  disable: boolean;
  hideDropdownIcon: boolean;
  useInput: boolean;
}

export interface ICheckboxComponent {
  components: ComponentName.CHECKBOX;
  disable: boolean;
  "true-value": string; // "true",
  "false-value": string; // "false",
  label: string;
  placeholder: string | undefined;
}

export interface IRadioButtonComponent {
  components: ComponentName.RADIO_BUTTON;
  name: string;
  disable: boolean;
  label: string;
  options: string[];
}

export interface IButtonComponent {
  component:
    | ComponentName.BUTTON
    | ComponentName.BUTTON_DELETE
    | ComponentName.BUTTON_VIEW
    | ComponentName.BUTTON_EDIT;
  color: string;
  type?: "submit" | "button"; // (default => submit),
  label?: string;
}
export interface ITabelComponent {
  // showToggleButtons: boolean;
  // showCopyButton: boolean;
  // scrollOption: boolean;
  // selectableItems: boolean;
  // translateValues: boolean;
  // showIdColumn: boolean;
  // flatActions: boolean;
  // showRowIndex: boolean;
  // hideBottom: boolean;
  // exports: { type: string }[]; // ['pdf']
  // actions: IButtonComponent[];
  lazyExpand: boolean;
  expandItems: ComponentName[]; // [{ component : '', ....}]
  items: Record<string, any>[];
  columns: {
    name: string;
    label: string;
    sortable: boolean;
    field: string;
  }[];
}

export type Component =
  | IInputComponent
  | IDatePickerComponent
  | ISelectComponent
  | ICheckboxComponent
  | IRadioButtonComponent
  | IButtonComponent
  | ITabelComponent;


