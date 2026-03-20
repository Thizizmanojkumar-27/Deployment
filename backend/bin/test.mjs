const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  console.log("---- FETCH INTERCEPTED ----");
  console.log("URL:", url);
  console.log("Options:", JSON.stringify(options, null, 2));
  console.log("---------------------------");
  return originalFetch(url, options);
};

import Bytez from "bytez.js";

const key = "d5b898c3d069b4f93f4e55271c7c953d";
const sdk = new Bytez(key);
const model = sdk.model("openai/gpt-4o-mini");

async function test() {
  await model.run([
    {
      "role": "user",
      "content": "Hello"
    }
  ]);
}

test();
