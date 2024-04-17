import { createCluster } from "redis";

async function main() {
  const cluster = await createCluster({
    rootNodes: [
      {
        url: "redis://127.0.0.1:7000",
      },
      {
        url: "redis://127.0.0.1:7001",
      },
      {
        url: "redis://127.0.0.1:7002",
      },
    ],
  })
    .on("error", (err) => console.log("Redis Client error: ", err))
    .connect();
  console.log("Connected to cluster successfully.");

  await cluster.quit();
}

main();
