import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// ✅ ADD MIDDLEWARE - Force emailVerified to false for new users
prisma.$use(async (params, next) => {
  // Intercept User create operations
  if (params.model === 'User' && params.action === 'create') {
    console.log('=== INTERCEPTING USER CREATE ===');
    console.log('Original data:', params.args.data);
    
    // Force emailVerified to false
    if (params.args.data.emailVerified !== undefined) {
      console.log('🔧 Overriding emailVerified from', params.args.data.emailVerified, 'to false');
      params.args.data.emailVerified = false;
    }
  }

  // Continue with the query
  const result = await next(params);
  
  if (params.model === 'User' && params.action === 'create') {
    console.log('✅ User created with emailVerified:', result.emailVerified);
  }
  
  return result;
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;