const AUTH_STORAGE_KEY = "smart-campus-auth";

export const saveAuthData = (data) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
};

export const getAuthData = () => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getToken = () => {
  const authData = getAuthData();
  return authData?.token || null;
};

export const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

export const buildAuthDataFromToken = (token) => {
  const payload = decodeJwtPayload(token);

  if (!payload) return null;

  return {
    token,
    userId: payload.userId || "",
    email: payload.sub || "",
    role: payload.role || "",
  };
};