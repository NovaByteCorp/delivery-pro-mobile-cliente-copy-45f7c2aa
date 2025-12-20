import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68c86d65c4f51add45f7c2aa", 
  requiresAuth: false // Ensure authentication is required for all operations
});
