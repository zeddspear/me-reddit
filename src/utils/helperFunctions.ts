// Function to introduce a delay of 2 seconds
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
