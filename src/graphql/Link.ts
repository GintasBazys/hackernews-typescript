import { objectType, extendType, nonNull, stringArg, idArg } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      },
    });
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context, info) {
        const { id } = args;
        const link = context.prisma.link.findUnique({
          where: {
            id: parseInt(id),
          },
        });

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
        const newLink = context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
          },
        });
        return newLink;
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
        const link = context.prisma.link.update({
          where: {
            id: parseInt(id),
          },
          data: {
            url: url,
            description: description,
          },
        });
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
        const link = context.prisma.link.delete({
          where: {
            id: parseInt(id),
          },
        });
        return link;
      },
    });
  },
});
