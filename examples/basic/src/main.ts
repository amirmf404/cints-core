import "./style.css";
import {
  CinCrudModelMetadata,
  CinFieldMetadata,
  CinModel,
  CrudActionsEnum,
} from "cints-core";
import { runDemo } from "./demo";
import { Address } from "./models/address.model";
import { Company } from "./models/company.model";
import { User } from "./models/user.model";

type Child = Node | string;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: { className?: string } = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  element.append(...children);
  return element;
}

function describeFlags(field: CinFieldMetadata): string {
  const flags = [
    field.isArray && "array",
    field.sortable && "sortable",
    field.searchable && "searchable",
    field.filterable && "filterable",
    field.copyable && "copyable",
    field.validation && "validated",
    field.dataPath && `path: ${field.dataPath}`,
    field.tab && `tab: ${field.tab.label}`,
    field.section && `section: ${field.section.label}`,
  ];
  return flags.filter(Boolean).join(", ");
}

function describeHiddenOn(field: CinFieldMetadata): string {
  return Object.values(CrudActionsEnum)
    .filter((action) => field.expose?.[action]?.expose === false)
    .join(", ");
}

function describePages(metadata: CinCrudModelMetadata): string {
  const pages = [
    metadata.createOptions.enable && "create",
    metadata.updateOptions.enable && "update",
    metadata.viewPageOptions.enable && "view",
    metadata.deleteOptions?.enable && "delete",
  ].filter(Boolean);
  return pages.length > 0 ? pages.join(", ") : "none";
}

function renderModel(model: typeof CinModel): HTMLElement {
  const metadata = model.getMetaData();
  const actions = [
    ...metadata.actions.rowActions,
    ...metadata.actions.modelActions,
  ].map((action) => action.label);

  const summary: [string, string][] = [
    ["Path", metadata.path],
    ["Enabled", describePages(metadata)],
    ["Repository", metadata.dataRepository ? "yes" : "no"],
    ["Labels", metadata.labels.map((label) => label.label).join(", ") || "none"],
    ["Actions", actions.join(", ") || "none"],
  ];

  const header = el(
    "tr",
    {},
    ...["Field", "Label", "Type", "Options", "Hidden on"].map((title) =>
      el("th", {}, title)
    )
  );
  const rows = Object.values(metadata.fields).map((field) =>
    el(
      "tr",
      {},
      el("td", {}, el("code", {}, field.name)),
      el("td", {}, field.label),
      el("td", {}, field.type ?? ""),
      el("td", {}, describeFlags(field)),
      el("td", {}, describeHiddenOn(field))
    )
  );

  return el(
    "section",
    { className: "card" },
    el("h3", {}, metadata.modelName),
    el(
      "dl",
      {},
      ...summary.flatMap(([term, value]) => [
        el("dt", {}, term),
        el("dd", {}, value),
      ])
    ),
    el(
      "div",
      { className: "table-wrapper" },
      el("table", {}, el("thead", {}, header), el("tbody", {}, ...rows))
    )
  );
}

async function render(root: HTMLElement) {
  root.append(
    el("h1", {}, "cints-core example"),
    el(
      "p",
      { className: "lead" },
      "Three models described with decorators, and what cints-core makes of them."
    ),
    el("h2", {}, "Model metadata"),
    ...[User, Company, Address].map(renderModel),
    el("h2", {}, "Using the metadata")
  );

  for (const step of await runDemo()) {
    root.append(
      el(
        "section",
        { className: "card" },
        el("h3", {}, step.title),
        el("p", {}, step.description),
        el("pre", {}, JSON.stringify(step.result, null, 2))
      )
    );
  }
}

const root = document.querySelector<HTMLDivElement>("#app")!;

render(root).catch((error: unknown) => {
  root.append(el("pre", { className: "error" }, String(error)));
  throw error;
});
