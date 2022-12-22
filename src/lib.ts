import assert from "assert";

const FETCH = /^fetch(?<subresource>.*?)$/;
const LIST = /^list(?<subresource>.*?)$/;
const CREATE = /^create(?<subresource>.*?)$/;
const REMOVE = /^remove(?<subresource>.*?)$/;
const UPDATE = /^update(?<subresource>.*?)$/;
const CUSTOM_VERB = /^(?<customVerb>[a-z]+?)(?<subresource>[A-Za-z]*?)$/;

const lowercaseFirstLetter = (text: string) => {
  return text.charAt(0).toLowerCase() + text.slice(1);
};

export const commandBuilder = new Proxy({} as any, {
  get(_target1, version: string) {
    return new Proxy(
      {},
      {
        get(_target2, resource: string) {
          return new Proxy(
            {},
            {
              get(_target3, command: string) {
                return (...args: unknown[]) => {
                  const fetchMatch = command.match(FETCH);
                  if (fetchMatch) {
                    const subresource = fetchMatch.groups?.subresource;
                    const [id, data] = args as [string, Record<string, string>];
                    if (subresource) {
                      return `curl -XGET /api/${version}/${resource}/${lowercaseFirstLetter(
                        subresource
                      )}/${id}?${new URLSearchParams(data)}`;
                    } else {
                      return `curl -XGET /api/${version}/${resource}/${id}?${new URLSearchParams(
                        data
                      )}`;
                    }
                  }

                  const listMatch = command.match(LIST);
                  if (listMatch) {
                    const subresource = listMatch.groups?.subresource;
                    const [data] = args as [Record<string, string>];
                    if (subresource) {
                      return `curl -XGET /api/${version}/${resource}/${lowercaseFirstLetter(
                        subresource
                      )}?${new URLSearchParams(data)}`;
                    } else {
                      return `curl -XGET /api/${version}/${resource}?${new URLSearchParams(
                        data
                      )}`;
                    }
                  }

                  const createMatch = command.match(CREATE);
                  if (createMatch) {
                    const subresource = createMatch.groups?.subresource;
                    const [data] = args;
                    if (subresource) {
                      return `curl -XPOST /api/${version}/${resource}/${lowercaseFirstLetter(
                        subresource
                      )} -d "${JSON.stringify(data)}"`;
                    } else {
                      return `curl -XPOST /api/${version}/${resource} -d "${JSON.stringify(
                        data
                      )}"`;
                    }
                  }

                  const removeMatch = command.match(REMOVE);
                  if (removeMatch) {
                    const subresource = removeMatch.groups?.subresource;
                    const [data] = args;
                    if (subresource) {
                      return `curl -XDELETE /api/${version}/${resource}/${lowercaseFirstLetter(
                        subresource
                      )} -d "${JSON.stringify(data)}"`;
                    } else {
                      return `curl -XDELETE /api/${version}/${resource} -d "${JSON.stringify(
                        data
                      )}"`;
                    }
                  }

                  const updateMatch = command.match(UPDATE);
                  if (updateMatch) {
                    const subresource = updateMatch.groups?.subresource;
                    const [data] = args;
                    if (subresource) {
                      return `curl -XPATCH /api/${version}/${resource}/${lowercaseFirstLetter(
                        subresource
                      )} -d "${JSON.stringify(data)}"`;
                    } else {
                      return `curl -XPATCH /api/${version}/${resource} -d "${JSON.stringify(
                        data
                      )}"`;
                    }
                  }

                  const customVerbMatch = command.match(CUSTOM_VERB);
                  if (customVerbMatch) {
                    const subresource = customVerbMatch.groups?.subresource;
                    const customVerb = customVerbMatch.groups?.subresource;
                    assert(customVerb);
                    const [data] = args;
                    if (subresource) {
                      return `curl -XPOST /api/${version}/${resource}/${lowercaseFirstLetter(
                        subresource
                      )}/${customVerb} -d "${JSON.stringify(data)}"`;
                    } else {
                      return `curl -XPOST /api/${version}/${resource}/${customVerb} -d "${JSON.stringify(
                        data
                      )}"`;
                    }
                  }
                };
              },
            }
          );
        },
      }
    );
  },
});
