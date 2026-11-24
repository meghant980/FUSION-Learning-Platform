# E-FUSION: local setup and what still needs your account details

## Quick start on Windows
1. Open this `FUSION0.1-main` folder in VS Code.
2. In PowerShell at this folder, run:
   ```powershell
   Copy-Item .\fusion-backend\.env.example .\fusion-backend\.env
   ```
   If `.env` already exists, do not overwrite it.
3. Edit `fusion-backend\.env`. Replace the MongoDB sample URI with the real URI from your MongoDB Atlas cluster. Set a private random `JWT_SECRET`. Add `GROQ_API_KEY` only if you use Groq-powered features.
4. Run the safe placeholder check:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\CHECK_EFUSION_ENV.ps1
   ```
5. Double-click `START_EFUSION_WINDOWS.bat` or run it from Explorer. It installs dependencies if needed and opens backend/frontend terminals separately.

## Required external setup
- MongoDB Atlas cluster, database user, password and Network Access allowlist are account-specific. This ZIP cannot create these or know their credentials.
- Groq API key is account-specific and is only needed by features that call Groq.
- Code execution currently calls the configured external runner endpoint in `fusion-backend/utils/runCode.js`; this ZIP does not provide a local sandbox/compiler service. The runner must be online and support the language IDs used by the project.

## Language practice scope found in this project
The backend CodingQuestion model accepts C, C++, Java, Python and JavaScript. The coding controller maps those five languages to Judge0 language IDs. The frontend also contains language-specific coding pages and an `AllLanguagePractice` page.

Important: supporting a language in code is not the same as having a complete question bank. Practice questions are stored in MongoDB (`CodingQuestion` collection). The ZIP does not contain your live Atlas database records, so all topics/levels/questions will appear only if they exist in that database or are added by a teacher/admin. This package does not claim to have automatically generated a complete syllabus question bank.

## Troubleshooting
- `querySrv ENOTFOUND ...YOUR_CLUSTER...`: the URI is still a sample; paste the actual Atlas URI.
- `MONGO_URI is missing`: `.env` is absent, in the wrong folder, or key spelling is wrong.
- `Authentication failed`: verify Atlas database username/password; URL-encode special characters in the password.
- `IP not allowed`: add your current public IP in Atlas Network Access.
- `nodemon is not recognized`: from `fusion-backend`, run `npm install`, then `npm run dev`.
- Do not run `npm audit fix --force` blindly; it may introduce breaking dependency changes.

## Security
Never share `.env`, database passwords, JWT secrets or API keys. Do not commit `.env` to source control.
