// test.js
import { createClient } from "./src/client.js";
import { handleGetComponentBySlug } from "./src/tools/get_component_by_slug.js";
import { handleGetPackBySlug } from "./src/tools/get_pack_by_slug.js";
import { handleListCategories } from "./src/tools/list_categories.js";
import { handleSearchComponentsSemantic } from "./src/tools/search_components_semantic.js";
import { handleCompilePack } from "./src/tools/compile_pack.js";
// Point to local dev server
const client = createClient(
  "pb_830ded48cbe5048ad9cb7891858c3bf7",
  "http://localhost:3000",
);

console.log("\n--- compile_pack ---");
const compiled = await handleCompilePack(
  { pack_slug: "employee-performance-review" },
  client,
);
console.log(compiled.content[0].text);

// console.log("\n--- list_categories ---");
// const cats = await handleListCategories(client);
// console.log(cats.content[0].text);

// console.log("\n--- search_components_semantic ---");
// const semantic = await handleSearchComponentsSemantic(
//   { query: "handle customer complaints", type: "protocol" },
//   client,
// );
// console.log(semantic.content[0].text);

// async function run() {
//   console.log("\n--- get_component_by_slug ---");
//   const comp = await handleGetComponentBySlug(
//     { slug: "hr-business-partner", type: "persona" },
//     client,
//   );
//   console.log(comp.content[0].text);

//   console.log("\n--- get_pack_by_slug ---");
//   const pack = await handleGetPackBySlug(
//     { slug: "employee-performance-review" },
//     client,
//   );
//   console.log(pack.content[0].text);
// }

// run().catch(console.error);
