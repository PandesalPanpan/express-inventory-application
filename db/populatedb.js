import { Client } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const SQL = `
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255),
    added TIMESTAMP WITH TIME ZONE DEFAULT now()    
);

CREATE TABLE IF NOT EXISTS room_types (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255),
    added TIMESTAMP WITH TIME ZONE DEFAULT now()
); 

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    room_number VARCHAR (4),
    capacity INTEGER CHECK (capacity >= 0),
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    added TIMESTAMP WITH TIME ZONE DEFAULT now()
);
    
CREATE TABLE IF NOT EXISTS rooms_room_types (
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    room_type_id INTEGER REFERENCES room_types(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, room_type_id)
);

INSERT INTO departments (name)
VALUES ('Computer Engineering'), ('Mechanical Engineering');

INSERT INTO room_types (name)
VALUES ('Lecture'), ('Computer Classroom'), ('Laboratory');

INSERT INTO rooms (room_number, capacity, department_id)
VALUES 
('311', 35, (SELECT id FROM departments WHERE name = 'Computer Engineering')),
('312', 50, (SELECT id FROM departments WHERE name = 'Computer Engineering')),
('105', 25, (SELECT id FROM departments WHERE name = 'Mechanical Engineering')),
('109', 40, (SELECT id FROM departments WHERE name = 'Mechanical Engineering'));

INSERT INTO rooms_room_types (room_id, room_type_id)
VALUES 
((SELECT id FROM rooms WHERE room_number = '311'), 
(SELECT id FROM room_types WHERE name = 'Computer Classroom')),
((SELECT id FROM rooms WHERE room_number = '311'),
(SELECT id FROM room_types WHERE name = 'Lecture')),
((SELECT id FROM rooms WHERE room_number = '312'),
(SELECT id FROM room_types WHERE name = 'Lecture')),
((SELECT id FROM rooms WHERE room_number = '105'),
(SELECT id FROM room_types WHERE name = 'Laboratory')),
((SELECT id FROM rooms WHERE room_number = '109'),
(SELECT id FROM room_types WHERE name = 'Lecture'));
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.DB_CONNECTION_STRING,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();