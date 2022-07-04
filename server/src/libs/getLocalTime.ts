export const getLocalTime = () =>
  new Date().toLocaleDateString("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
