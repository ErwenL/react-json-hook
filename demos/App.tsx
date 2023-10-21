import { useState } from "react";
import reactLogo from "/react.svg";
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
      <div className="flex h-screen flex-col gap-4 items-center">
        {/* logo */}
        <div className="flex items-center mt-10">
          <img
            className="h-24 p-4 animate-spin"
            style={{ animationDuration: "5s" }}
            src={reactLogo}
            alt="React logo"
          />
          <h1 className="pr-6">React-Json-Hook</h1>
        </div>
        {/* selector */}
        <div className="flex items-center hover:outline outline-sky-500 p-2 rounded-lg duration-150 ease-in-out">
          <span className="px-2 font-bold font-mono text-sky-400">
            renderTypeDefs:
          </span>
          <select
            className="px-2 font-mono text-slate-200 bg-transparent outline-none "
            value={renderTypeDefsChoice}
            onChange={(e) => {
              setRenderTypeDefsChoice(e.target.value);
            }}
          >
            {Object.keys(renderTypeDefsOptions).map((key) => (
              <option
                className="text-slate-500 bg-slate-900 "
                key={key}
                value={key}
              >
                {key}
              </option>
            ))}
          </select>
        </div>
        {/* json Viewer */}
        <div className="flex flex-col-1 w-full justify-center overflow-auto mb-4">
          <div className="w-3/4 max-w-xl h-fit max-h-full whitespace-nowrap overflow-auto bg-gray-950/40 p-4 rounded-xl shadow-md">
            {root.renderPropsArray!().map((props) =>
              nodeRender(props, renderTypeDefs)
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
