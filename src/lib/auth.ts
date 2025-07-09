export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Local storage keys
const USER_KEY = 'subly_user';
const AUTH_TOKEN_KEY = 'subly_auth_token';

// Generate a simple ID for demo purposes
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Save user data to local storage
export const saveUserToStorage = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token-' + user.id);
  }
};

// Get user data from local storage
export const getUserFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Remove user data from local storage
export const removeUserFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
  }
  return false;
};

// Signup function
export const signup = async (name: string, email: string, _password: string): Promise<AuthResponse> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = getUserFromStorage();
    if (existingUser && existingUser.email === email) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    // Save to local storage
    saveUserToStorage(newUser);

    return {
      success: true,
      user: newUser
    };
  } catch {
    return {
      success: false,
      error: 'Failed to create account'
    };
  }
};

// Login function
export const login = async (email: string, _password: string): Promise<AuthResponse> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get user from storage
    const user = getUserFromStorage();
    
    if (!user || user.email !== email) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // In a real app, you'd verify the password here
    // For demo purposes, we'll just check if the user exists

    return {
      success: true,
      user
    };
  } catch {
    return {
      success: false,
      error: 'Failed to sign in'
    };
  }
};

// Logout function
export const logout = (): void => {
  removeUserFromStorage();
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getUserFromStorage();
}; 