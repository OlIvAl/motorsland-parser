export const API_ROOT =
  process.env.NODE_ENV === "production"
    ? "https://motorsland-api.azurewebsites.net"
    : "http://localhost:3001";
