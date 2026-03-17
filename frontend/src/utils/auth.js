export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem('morningwood_user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('morningwood_user', JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem('morningwood_user');
};
