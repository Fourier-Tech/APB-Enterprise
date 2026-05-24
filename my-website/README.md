This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Mobile Testing & Local Network IP Access

To test the responsive designs and interactions on your physical phone:

### Option A: Local Wi-Fi Network (IP Route)
Ensure your phone is connected to the **same Wi-Fi network** as your computer.
1. Start the dev server (pre-configured with `--hostname 0.0.0.0` in `package.json` to bind to all adapters):
   ```bash
   npm run dev
   ```
2. Find your computer's local network IP address (run `ipconfig` in Windows PowerShell/Command Prompt).
3. Open your phone's mobile browser and type in your IP address followed by port `:3000`. For example:
   `http://192.168.1.15:3000`

### Option B: Free Secure Tunnel (Localtunnel — Foolproof & Instant)
If you are on a restricted Wi-Fi network (like a public cafe, university housing, or office network) that has "Client Isolation" enabled (which blocks devices from communicating directly), or if your local firewall blocks port `3000`, use a secure tunnel instead:
1. While your dev server is running on port `3000`, open a **new terminal window** in your project directory and run:
   ```bash
   npx localtunnel --port 3000
   ```
2. Copy the secure public link printed in your terminal (e.g., `https://some-unique-url.loca.lt`) and open it on your phone over Wi-Fi or cellular mobile data.
3. *Note: If asked for a "Tunnel Password" on the first visit, simply type in your PC's public IP address (which you can find by googling "what is my ip" on your computer) and click submit.*

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
