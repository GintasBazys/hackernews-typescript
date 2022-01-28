import { objectType, extendType, nonNull, stringArg, idArg, list } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

let links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return links;
      },
    });
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context, info) {
        const { id } = args;
        const link = links.find((link) => link.id.toString() === id);
        return link;
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const { description, url } = args;
        let idCount = links.length + 1;
        const link = {
          id: idCount,
          description: args.description,
          url: args.url,
        };
        links.push(link);
        return link;
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
        url: stringArg(),
        description: stringArg(),
      },
      resolve(parent, args, context) {
        const { id, url, description } = args;
        const link = links.find((link) => link.id.toString() === id);
        link?.url = url;
        link?.description = description;
        return link;
      },
    });
    t.nonNull.field("deleteLink", {
      type: Link,
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context) {
        const { id } = args;
        const index = links.findIndex((link) => link.id.toString() === id);
        const link = links[index];
        links.splice(index, 1);
        return link;
      },
    });
  },
});
