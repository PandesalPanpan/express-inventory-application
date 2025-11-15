import pool from "./pool.js";

export async function getAllRooms() {
    // Fetch the id, name, capacity, department_id, all_room_types_name, 

    const { rows } = await pool.query(`
        SELECT 
            r.id, 
            r.room_number, 
            r.capacity, 
            r.department_id,
            string_agg(DISTINCT rt.name, ', ' ORDER BY rt.name) AS room_types
        FROM rooms as r
        LEFT JOIN rooms_room_types as rrt
        ON (rrt.room_id = r.id)
        LEFT JOIN room_types as rt
        ON (rt.id = rrt.room_type_id)
        GROUP BY r.id, r.room_number, r.capacity, r.department_id
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
            const values = uniques.map((_, index) => `($1, $${index + 2})`).join(', ');

            await client.query(
                `INSERT INTO rooms_room_types (room_id, room_type_id)
                VALUES ${values}
                ON CONFLICT DO NOTHING`,
                [roomId, ...uniques]
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
