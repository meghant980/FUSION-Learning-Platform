# E-FUSION — Local setup (Windows / VS Code)

## Before starting
- Install Node.js 18.x (the backend package currently declares Node 18.x).
- Have a MongoDB Atlas database/cluster and connection string ready.
- Obtain a Groq API key only if you use the AI/Groq features.
- Never send your `.env` file or API keys to anyone.

## 1. Configure backend environment
1. Open `fusion-backend`.
2. Copy `.env.example` and rename the copy to `.env`.
   PowerShell command from the project root:
   `Copy-Item .\fusion-backend\.env.example .\fusion-backend\.env`
3. Open `fusion-backend/.env` and replace the placeholders:
   - `MONGO_URI`: your real MongoDB Atlas connection string.
   - `JWT_SECRET`: a long random secret of your own.
   - `GROQ_API_KEY`: your own Groq key if using Groq-powered features.
4. In MongoDB Atlas, add your current IP address to Network Access and create a database user.
   Ensure the password in the URI is URL-encoded if it contains special characters.
   Do not paste angle-bracket placeholders literally.

## 2. Install and run backend
Open Terminal 1 at the `FUSION0.1-main` project folder:
```powershell
cd fusion-backend
npm install
npm run dev
```
Expected: `MongoDB Connected` and `Fusion Backend running on port 5001`.
The Node 22 vs Node 18 engine message is a warning; this project declares Node 18.x, so Node 18 is the recommended runtime.

## 3. Install and run frontend
Open Terminal 2 at the `FUSION0.1-main` project folder:
```powershell
cd fusion-frontend
npm install
npm start
```
The React app normally opens at http://localhost:3000.

## Troubleshooting
- `MONGO_URI is missing`: `.env` is missing, in the wrong folder, or does not contain `MONGO_URI=...`.
- `Authentication failed`: verify the MongoDB database username/password.
- `IP not allowed`: add your current IP in MongoDB Atlas Network Access.
- `GROQ_API_KEY` errors: add your own key to `.env` if the feature you opened requires Groq.
- Keep Terminal 1 running while using the frontend.

## Important
This ZIP cannot contain your private MongoDB URI or Groq API key. Those credentials must be entered by you locally. The `.env.example` file is a template, not a working credential file.


## Fix for `querySrv ENOTFOUND _mongodb._tcp.YOUR_CLUSTER.mongodb.net`
This error means the `.env` file still contains the sample text `YOUR_CLUSTER` (or another placeholder). It is not a code/package issue.

1. In MongoDB Atlas, open your cluster and choose **Connect → Drivers → Node.js**.
2. Copy the connection string shown by Atlas.
3. Replace the sample `MONGO_URI` value in `fusion-backend/.env` with that real connection string. Replace the username, password and host with the values Atlas provides.
4. In Atlas **Network Access**, allow your current IP address; in **Database Access**, ensure the database user exists.
5. Save `.env`, then in the backend terminal run `rs` (or stop and restart `npm run dev`).

A ZIP cannot contain a working MongoDB URI or Groq key for your account. Those are private account credentials and must be added locally. Never send them in chat or commit `.env` to Git.


## Full language coding practice question bank

The project now includes a seed bank of **200 practice questions**: 5 languages (C, C++, Java, Python and JavaScript) × 4 units × 10 questions per unit. Questions are stored in MongoDB and loaded by the All Language Practice page. The existing coding workspace uses Judge0 Community Edition for actual code execution, so an active internet connection and the public Judge0 service are required.

After MongoDB is running and `fusion-backend/.env` contains the correct `MONGO_URI`:

1. Open a terminal in `fusion-backend`.
2. Run `npm install` if dependencies are not installed.
3. Run `npm run seed:practice` once. It is safe to run again; matching questions are updated rather than duplicated.
4. Keep the backend running with `npm run dev`.
5. In `fusion-frontend`, create `.env.local` with `REACT_APP_API_URL=http://localhost:5001`.
6. Run `npm install` if needed, then `npm start`.
7. Open All Language Practice, select a language and unit, open a question, write code and press Run.

Topics include fundamentals, conditionals, loops, arrays, strings, functions, searching/sorting, OOP, collections, recursion, exceptions and 2D arrays.
