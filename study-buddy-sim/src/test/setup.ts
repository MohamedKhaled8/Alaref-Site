import "@testing-library/jest-dom";
import fs from "fs";

if (typeof require !== "undefined" && require.extensions) {
  try {
    const swc = require("@swc/core");
    const compile = (module: any, filename: string) => {
      const content = fs.readFileSync(filename, "utf8");
      const result = swc.transformSync(content, {
        module: { type: "commonjs" },
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: filename.endsWith(".tsx"),
          },
          transform: {
            react: { runtime: "automatic" },
          },
        },
      });
      module._compile(result.code, filename);
    };

    require.extensions[".ts"] = compile;
    require.extensions[".tsx"] = compile;
  } catch {
    // ignore
  }
}
