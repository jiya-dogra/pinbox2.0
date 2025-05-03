// auth.ts
export const login = (userType: string, userId: string) => {
  // Store in localStorage (persists until explicitly cleared)
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userType', userType);
  localStorage.setItem('userId', userId);
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  return {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userType: localStorage.getItem('userType'),
    userId: localStorage.getItem('userId')
  };
};

export const isAdmin = () => {
  return localStorage.getItem('userType') === 'admin';
};

export const isEmployee = () => {
  return localStorage.getItem('userType') === 'employee';
};

export const getAdminId = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('userId');
};