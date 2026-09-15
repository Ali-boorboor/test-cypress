import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://192.168.137.1:4173",
  },
  env: {
    ADMIN_USERNAME: "sysop",
    ADMIN_PASSWORD: "sysop",
  },
});
