import { createClient } from "redis";
import * as fs from "node:fs";

const FILENAME = "large-file.json";
const MAIN_KEY = "events";

async function main() {
  if (process.argv.length !== 3) {
    console.log("Usage: node index.js <command>");
    console.log("Possible commands: json, hset, zset, list");
    process.exit(1);
  }
  const command = process.argv[2];

  const client = await createClient()
    .on("error", (err) => console.log("Redis Client error: ", err))
    .connect();
  console.log("Succesfully connected to Redis.");

  const content = fs.readFileSync(FILENAME, "utf-8");
  const jsonData = JSON.parse(content);
  console.log("Data from the file was read and parsed successfully.");

  await client.flushDb();
  switch (command) {
    case "json":
      await utilizeAsJSON(client, jsonData);
      break;
    case "hset":
      await utilizeAsHSET(client, jsonData);
      break;
    case "zset":
      await utilizeAsZSET(client, jsonData);
      break;
    case "list":
      await utilizeAsLIST(client, jsonData);
      break;
  }

  await client.disconnect();
}

async function utilizeAsJSON(client, data) {
  let start = new Date();
  await client.json.set(MAIN_KEY, "$", data);
  let end = new Date();
  console.log(`Insertion as JSON takes ${end.getTime() - start.getTime()}ms`);

  start = new Date();
  await client.json.get(MAIN_KEY, { path: ["[0].repo"] });
  end = new Date();
  console.log(
    `Simple read of first object inside array takes ${
      end.getTime() - start.getTime()
    }ms`
  );

  start = new Date();
  await client.json.get(MAIN_KEY, { path: ["[1000].id", "[2000].actor.id"] });
  end = new Date();
  console.log(
    `More complex read of 1000nd and 2000nd object inside array takes ${
      end.getTime() - start.getTime()
    }ms`
  );

  console.log(await client.ft.search());
}

async function utilizeAsHSET(client, data) {
  let start = new Date();
  for (const obj of data) {
    const hashKey = obj.id;
    const fields = Object.keys(obj);

    const index = fields.indexOf("id");
    if (index > -1) {
      fields.splice(index, 1);
    }

    const fieldValues = fields.reduce((acc, key) => {
      acc.push(key, JSON.stringify(obj[key]));
      return acc;
    }, []);

    await client.hSet(`${MAIN_KEY}:${hashKey}`, fieldValues);
  }
  let end = new Date();
  console.log(`Insertion as HSET takes ${end.getTime() - start.getTime()}ms`);

  start = new Date();
  await client.hGetAll(`${MAIN_KEY}:2489651105`);
  end = new Date();
  console.log(
    `Simple read of the object by ID 2489651105 takes ${
      end.getTime() - start.getTime()
    }ms`
  );
}

async function utilizeAsZSET(client, data) {
  let start = new Date();
  for (const obj of data) {
    const score = new Date(obj.created_at).getTime();
    await client.zAdd(MAIN_KEY, { score, value: JSON.stringify(obj) });
  }
  let end = new Date();
  console.log(`Insertion as ZSET takes ${end.getTime() - start.getTime()}ms`);

  start = new Date();
  await client.zRangeByScore(MAIN_KEY, "-inf", 1420124405000);
  end = new Date();
  console.log(
    `Read of events before 2015-01-01T15:00:05Z takes ${
      end.getTime() - start.getTime()
    }ms`
  );

  start = new Date();
  await client.zRange(MAIN_KEY, 0, 10);
  end = new Date();
  console.log(`Read of first ten events takes ${end.getTime() - start.getTime()}ms`);
}

async function utilizeAsLIST(client, data) {
  let start = new Date();
  for (const obj of data) {
    await client.lPush(MAIN_KEY, JSON.stringify(obj));
  }
  let end = new Date();
  console.log(`Insertion as LIST takes ${end.getTime() - start.getTime()}ms`);

  start = new Date();
  await client.lRange(MAIN_KEY, 0, 10);
  end = new Date();
  console.log(`Read of first ten events takes ${end.getTime() - start.getTime()}ms`);

  start = new Date();
  await client.lPop(MAIN_KEY);
  end = new Date();
  console.log(`LPOP takes ${end.getTime() - start.getTime()}ms`);

  start = new Date();
  await client.rPop(MAIN_KEY);
  end = new Date();
  console.log(`RPOP takes ${end.getTime() - start.getTime()}ms`);
}

main();
