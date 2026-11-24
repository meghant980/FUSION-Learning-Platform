E-FUSION FULL LANGUAGE PRACTICE UPDATE

Included:
- 200 database-backed questions: 5 languages x 4 units x 10 questions.
- Topic coverage: fundamentals, decisions, loops, arrays, strings, functions, searching/sorting, OOP, collections, recursion, exceptions and matrices.
- Existing coding workspace and real Judge0-backed run flow retained.
- Frontend coding pages use REACT_APP_API_URL and default to http://localhost:5001.

Load questions:
1. Start MongoDB and configure fusion-backend/.env (MONGO_URI).
2. In fusion-backend run: npm install
3. In fusion-backend run: npm run seed:practice
4. Start backend: npm run dev
5. In fusion-frontend create .env.local with REACT_APP_API_URL=http://localhost:5001
6. In fusion-frontend run: npm install, then npm start.

Judge0 Community Edition is used for actual execution; internet and the public Judge0 service are required.
