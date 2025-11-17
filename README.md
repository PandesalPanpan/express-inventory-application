# inventory-application (Odin Project) — Classroom CRUD

Small classroom inventory CRUD app (Odin Project). Manage Departments, Rooms and Room Types with full Create / Read / Update / Delete flows and a many‑to‑many relation between rooms and room types.

Quick start
- Requirements: Node.js, npm, PostgreSQL
- Copy or create .env with DATABASE_URL (and optionally PORT)
- Install and seed:
  - npm install
  - npm run seed   # runs db/populatedb.js to create tables + seed data
- Run:
  - node --watch app.js

Database (high level)
- departments (id, name, added)
- room_types (id, name, added)
- rooms (id, room_number, capacity, department_id NULLABLE, added)
- rooms_room_types (room_id, room_type_id) — join table, PK (room_id, room_type_id)
Notes:
- rooms_room_types uses FK constraints and ON DELETE CASCADE for join cleanup.
- department_id is nullable; empty select should be normalized to NULL before UPDATE/INSERT.

Key implementation notes
- Use transactions + RETURNING for creating/updating rooms that also update join table.
- Use INSERT ... SELECT $1, id FROM room_types WHERE id = ANY($2) to bulk insert join rows safely.
- Forms pass checkbox arrays as name="room_types_ids[]"; normalize in controller (string → number[]).
- Validation uses express-validator with .optional({ checkFalsy: true, nullable: true }) for optional fields.

Routes (examples)
- GET /               — index
- GET /rooms          — list rooms
- GET /room/create    — create form
- POST /room/create   — create room (accepts room_types_ids[] array)
- GET /room/:id       — view / edit room
- POST /room/:id?_method=PUT  — update (method-override)
- DELETE /room/:id    — delete
- GET /departments, /department/create, DELETE /department/:id, etc.