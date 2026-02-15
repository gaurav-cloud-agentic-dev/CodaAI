import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// ❌ MIDDLEWARE REMOVED
// We don't need this anymore because we handle verification differently:
// - GitHub users: emailVerified = true (set in callback)
// - Google users: emailVerified = false (set in callback)
// The middleware was forcing ALL users to false, which broke GitHub auth

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;