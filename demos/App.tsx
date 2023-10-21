import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { useJson, nodeRender, RenderTypeDefs } from "../src";
import sampleData from "./data/base.json";
import baseRenderTypeDefs from "./renderTypeDefs/default";
import slatePinkRenderTypeDefs from "./renderTypeDefs/slatePink";

const renderTypeDefsOptions: { [key: string]: RenderTypeDefs } = {
  base: baseRenderTypeDefs,
  slatePink: slatePinkRenderTypeDefs,
};

function App() {
  const [renderTypeDefsChoice, setRenderTypeDefsChoice] =
    useState<string>("base");
  const renderTypeDefs = renderTypeDefsOptions[renderTypeDefsChoice];
  const root = useJson(sampleData, renderTypeDefs);

  return (
    <>
      <div className="flex h-screen flex-col items-center gap-4">
        {/* logo */}
        <div className="mt-10 flex items-center">
          <img
            className="h-24 animate-spin p-4"
            style={{ animationDuration: "5s" }}
            src={reactLogo}
            alt="React logo"
          />
          <h1 className="pr-6">React-Json-Hook</h1>
        </div>
        {/* render type defs selector */}
        <div className="group flex items-center rounded-lg p-2 outline-sky-500 duration-150 ease-in-out hover:outline group-focus-within:outline">
          <label className="px-2 font-mono font-bold text-sky-400">
            renderTypeDefs:
          </label>
          <select
            id="renderTypeDefsSelector"
            name="renderTypeDefsSelector"
            className="bg-transparent px-2 font-mono text-slate-200 outline-none "
            value={renderTypeDefsChoice}
            onChange={(e) => {
              setRenderTypeDefsChoice(e.target.value);
            }}
            
          >
            {Object.keys(renderTypeDefsOptions).map((key) => (
              <option className="bg-slate-900" key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        {/* json Viewer */}
        <div className="flex-col-1 mb-4 flex w-full justify-center overflow-auto">
          <div className="h-fit max-h-full w-3/4 max-w-xl overflow-auto whitespace-nowrap rounded-xl bg-gray-950/40 p-4 shadow-md">
            {root.renderPropsArray!().map((props) =>
              nodeRender(props, renderTypeDefs),
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
