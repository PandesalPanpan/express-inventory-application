import pool from "./pool.js";

export async function getAllRooms() {
    // Fetch the id, name, capacity, department_id, all_room_types_name, 

    const { rows } = await pool.query(`
        SELECT 
            r.id, 
            r.room_number, 
            r.capacity, 
            d.name as department_name,
            string_agg(DISTINCT rt.name, ', ' ORDER BY rt.name) AS room_types
        FROM rooms as r
        LEFT JOIN departments as d
        ON (r.department_id = d.id)
        LEFT JOIN rooms_room_types as rrt
        ON (rrt.room_id = r.id)
        LEFT JOIN room_types as rt
        ON (rt.id = rrt.room_type_id)
        GROUP BY r.id, r.room_number, r.capacity, d.name
        ORDER BY r.room_number;
        `);

    return rows;
}

// I have not tested this fully
export async function createRoom(room_number, capacity, department_id, room_types_ids) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows } = await client.query(`
            INSERT INTO rooms (room_number, capacity, department_id)
            VALUES (
                $1, $2, $3
            )
            RETURNING id;
            `, [room_number, capacity, department_id ?? null]
        );
        const roomId = rows[0].id;

        if (room_types_ids && room_types_ids.length) {
            const uniques = [...new Set(room_types_ids)];

            await client.query(
                `INSERT INTO rooms_room_types (room_id, room_type_id)
                SELECT $1, id FROM room_types WHERE id = ANY($2)
                ON CONFLICT DO NOTHING`,
                [roomId, uniques]
            );
        }

        await client.query('COMMIT');
        return roomId;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function getRoom(roomId) {
    const { rows } = await pool.query(`
        SELECT * FROM rooms
        WHERE id = $1
        `, [roomId]);
    return rows[0] || null;
}

export async function updateRoom(
    room_id, room_number, capacity, department_id, room_types_ids,
) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query(`
            UPDATE rooms
            SET 
                room_number = $2,
                capacity = $3,
                department_id = $4
            WHERE id = $1
            `, [room_id, room_number, capacity, department_id ?? null]);

        if (room_types_ids !== undefined) {
            if (!room_types_ids.length) {
                // Remove all association
                await client.query(`DELETE FROM rooms_room_types WHERE room_id = $1`, [room_id])
            } else {
                const uniqueIds = [...new Set(room_types_ids)];

                // Delete rows that did not match
                await client.query(`
                    DELETE FROM rooms_room_types
                    WHERE room_id = $1
                    AND NOT (room_type_id = ANY($2))
                    `, [room_id, uniqueIds]
                );

                // Insert all missing association by using ON CONFLICT DO NOTHING to avoid duplicates
                await client.query(`
                    INSERT INTO rooms_room_types (room_id, room_type_id)
                    SELECT $1, id FROM room_types WHERE id = ANY($2)
                    ON CONFLICT DO NOTHING`,
                    [room_id, uniqueIds]
                );
            }

        }

        await client.query("COMMIT");
        return true;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

export async function deleteRoom(room_id) {
    const { rows } = await pool.query(`
        DELETE FROM rooms WHERE id = $1 RETURNING *`,
        [room_id]
    );

    if (!rows.length) throw new Error("Room not found");

    return rows[0];
}

// Department Queries
// 1. Create Department
// 2. Get Department
// 3. Get All Department
// 4. Get All Rooms by Department
// 5. Update Department
// 6. Delete Department

export async function getAllDepartments() {
    const { rows } = await pool.query(`
        SELECT * FROM departments
        `);
    return rows;
}

export async function getDepartment(department_id) {
    const { rows } = await pool.query(`
        SELCT * FROM departments
        WHERE id = $1`, [department_id]
    );

    return rows[0];
}

export async function createDepartment(name) {
    const { rows } = await pool.query(`
        INSERT INTO departments (name)
        VALUES ($1)
        RETURNING *
        `, [name])
    return rows[0];
}

export async function updateDepartment(department_id, name) {
    const { rows } = await pool.query(`
        UPDATE departments
        SET name = $2
        WHERE id = $1
        RETURNING *
        `, [department_id, name]);

    return rows[0];
}

export async function deleteDepartment(department_id) {
    const { rowCount } = await pool.query(`
        DELETE FROM departments
        WHERE id = $1
        `, [department_id])
    return rowCount > 0;
}

export async function getRoomsByDepartment(department_id) {
    const { rows } = await pool.query(`
        SELECT * FROM rooms as r
        WHERE department_id = $1
        `, [department_id]);

    return rows;
}

export async function getAllRoomTypes() {
    const { rows } = await pool.query(`
        SELECT id, name FROM room_types;
        `);

    return rows;
}