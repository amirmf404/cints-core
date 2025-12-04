import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";
import { CinCrudModel, CinModel } from "../../dist/index";
import { inspect } from "util";

@CinCrudModel({})
class A extends CinModel {}

@CinCrudModel({})
class B extends A {}

@CinCrudModel({})
class C extends A {}

C.getMetaData();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div>
    A:${JSON.stringify(A.getMetaData())}<br/>
    B:${JSON.stringify(B.getMetaData())}<br/>
    C:${JSON.stringify(C.getMetaData())}<br/>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
