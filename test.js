// test.js
import { createClient } from "./src/client.js";
import { handleGetComponentBySlug } from "./src/tools/get_component_by_slug.js";
import { handleGetPackBySlug } from "./src/tools/get_pack_by_slug.js";

// Point to local dev server
const client = createClient(
  "pb_830ded48cbe5048ad9cb7891858c3bf7",
  "http://localhost:3000",
);

async function run() {
  console.log("\n--- get_component_by_slug ---");
  const comp = await handleGetComponentBySlug(
    { slug: "hr-business-partner", type: "persona" },
    client,
  );
  console.log(comp.content[0].text);

  console.log("\n--- get_pack_by_slug ---");
  const pack = await handleGetPackBySlug(
    { slug: "employee-performance-review" },
    client,
  );
  console.log(pack.content[0].text);
}

run().catch(console.error);
