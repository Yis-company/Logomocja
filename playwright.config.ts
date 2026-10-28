import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./e2e', fullyParallel:false, workers:1, timeout:30000,
  use:{baseURL:'http://localhost:5173',viewport:{width:1280,height:900},launchOptions:{args:['--use-angle=swiftshader','--enable-webgl']}},
  webServer:{command:'bun run dev',url:'http://localhost:5173',reuseExistingServer:true},
});
