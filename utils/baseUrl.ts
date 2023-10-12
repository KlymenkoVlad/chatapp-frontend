export const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3001"
    : "https://dull-red-bat-slip.cyclic.app";

export const frontendUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://newmarket-shop.vercel.app";
