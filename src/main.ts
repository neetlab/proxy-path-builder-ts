import assert from "assert";
import { commandBuilder as masto } from "./lib";

assert.equal(
  masto.v1.favourites.list({ query: "value" }),
  "curl -XGET /api/v1/favourites?query=value"
);

assert.equal(
  masto.v1.statuses.fetch("123", { query: "value" }),
  "curl -XGET /api/v1/statuses/123?query=value"
);

assert.equal(
  masto.v1.statuses.create({ content: "foo" }),
  `curl -XPOST /api/v1/statuses -d "{"content":"foo"}"`
);

assert.equal(
  masto.v1.statuses.listHome({ query: "value" }),
  `curl -XGET /api/v1/statuses/home?query=value`
);
