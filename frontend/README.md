# Zorvyn Frontend

This is a minimal React frontend scaffold for the Zorvyn project.

Quick start:

1. cd frontend
2. npm install
3. npm run dev

Notes:
- Backend assumed to run on http://localhost:8000 (match backend .env if different)
- Login stores `token` and `user` in `localStorage`. Protected routes check `user.role`.
