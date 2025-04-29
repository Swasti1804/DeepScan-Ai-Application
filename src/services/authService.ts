// src/services/authService.ts

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  // Simulated users database
  const USERS_DB: Record<
    string, 
    { 
      id: string; 
      email: string; 
      name: string; 
      password: string; 
      avatar?: string;
      googleId?: string;
    }
  > = {};
  
  // Simulated JWT tokens storage
  const TOKENS_DB: Record<string, string> = {};
  
  // Simulated API delay (800ms - 1.2s)
  const simulateDelay = () => new Promise<void>(resolve => 
    setTimeout(resolve, 800 + Math.random() * 400)
  );
  
  // Generate mock JWT token
  const generateMockToken = (userId: string): string => {
    return `mock_jwt_${userId}_${Date.now()}`;
  };
  
  // Login user
  export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    await simulateDelay();
    
    const user = Object.values(USERS_DB).find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    const token = generateMockToken(user.id);
    TOKENS_DB[user.id] = token;
    
    // Return user without password
    const { password: _, googleId: __, ...userData } = user;
    return { user: userData, token };
  };
  
  // Register user
  export const registerUser = async (
    email: string, 
    password: string, 
    name: string
  ): Promise<AuthResponse> => {
    await simulateDelay();
    
    if (Object.values(USERS_DB).some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const id = `user_${Date.now()}`;
    const newUser = { id, email, name, password };
    USERS_DB[id] = newUser;
    
    const token = generateMockToken(id);
    TOKENS_DB[id] = token;
    
    // Return user without password
    const { password: _, ...userData } = newUser;
    return { user: userData, token };
  };
  
  // Google authentication
  export const googleAuth = async (credential: string): Promise<AuthResponse> => {
    await simulateDelay();
    
    // Mock decoding of Google credential
    const mockUserData = {
      email: `user${Object.keys(USERS_DB).length + 1}@example.com`,
      name: 'Google User',
      picture: 'https://example.com/avatar.jpg',
      sub: `google_${Date.now()}`
    };
    
    // Check if user already exists by googleId
    let user = Object.values(USERS_DB).find(u => u.googleId === mockUserData.sub);
    
    if (!user) {
      // Check if email exists but without googleId
      user = Object.values(USERS_DB).find(u => u.email === mockUserData.email);
      
      if (user) {
        // Merge accounts
        user.googleId = mockUserData.sub;
        user.avatar = mockUserData.picture;
      } else {
        // Create new user
        const id = `user_${Date.now()}`;
        user = {
          id,
          email: mockUserData.email,
          name: mockUserData.name,
          password: '', // No password for Google users
          avatar: mockUserData.picture,
          googleId: mockUserData.sub
        };
        USERS_DB[id] = user;
      }
    }
    
    const token = generateMockToken(user.id);
    TOKENS_DB[user.id] = token;
    
    // Return user without sensitive data
    const { password: _, googleId: __, ...userData } = user;
    return { user: userData, token };
  };
  
  // Logout user
  export const logoutUser = async (): Promise<void> => {
    await simulateDelay();
    // In a real implementation, we would invalidate the token
    return;
  };
  
  // Verify token (for protected routes)
  export const verifyToken = async (token: string): Promise<User> => {
    await simulateDelay();
    
    const userId = Object.keys(TOKENS_DB).find(id => TOKENS_DB[id] === token);
    
    if (!userId || !USERS_DB[userId]) {
      throw new Error('Invalid token');
    }
    
    const { password: _, googleId: __, ...user } = USERS_DB[userId];
    return user;
  };
  
  // Get current user (for initialization)
  export const getCurrentUser = async (): Promise<User | null> => {
    await simulateDelay();
    
    // In a real app, this would check localStorage for token
    // and verify it with the backend
    return null;
  };