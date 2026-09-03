import { createApp } from "./app";

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Validation endpoint: http://localhost:${PORT}/api/v1/validate`);
});
