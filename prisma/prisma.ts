// import { PrismaClient } from '@prisma/client';

// const client = (globalThis as any).prisma || new PrismaClient();

// if (process.env.NODE_ENV === 'development') (globalThis as any).prisma = client;

// export default client;

import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export default prisma;