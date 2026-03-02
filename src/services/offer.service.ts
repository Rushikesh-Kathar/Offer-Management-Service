import { conn } from '../config/db.js';
import { ulid } from 'ulid';
import { RowDataPacket, ResultSetHeader } from "mysql2";
interface offerData {
    offer_name: string;
    description: string;
    discount_type: string;
    discount_value: number;
    start_date: Date;
    end_date: Date;
    status: string;
}
interface SearchEnquiryParams {
    offer_name?: string;
    discount_type?: string;
    discount_value?: number;
    start_date?: Date;
    end_date?: Date;
    status?: string;
}


export const createOffer = async (offerData: offerData) => {


    const { offer_name, description, discount_type, discount_value, start_date, end_date, status } = offerData;
    if (!offer_name || !description || !discount_type || !discount_value || !start_date || !end_date || !status) {
        throw new Error('Missing required fields');
    }
    const connection = await conn.getConnection();
    try {
        await connection.beginTransaction();
        const [existing] = await connection.query<RowDataPacket[]>(
            'SELECT id FROM offers WHERE offer_name=?',
            [offer_name]
        )
        if (existing.length > 0) {
            throw new Error('Offer already present');
        }


        const userId = ulid();

        await connection.query<ResultSetHeader>(
            'INSERT INTO offers (id, offer_name, description, discount_type, discount_value, start_date, end_date, status) VALUES (?,?,?,?,?,?,?,?)',
            [userId, offer_name, description, discount_type, discount_value, start_date, end_date, status]
        );


        await connection.commit();
        console.log('Transaction committed successfully');


    } catch (err: any) {
        await connection.rollback();
        console.error('DB ERROR:', err);
        console.error('SQL Message:', err.sqlMessage);
        console.error('SQL State:', err.sqlState);
        console.error('Error Code:', err.code);
        throw err;
    } finally {
        connection.release();
    }


}

export const getallOffers = async () => {
    const connection = await conn.getConnection();
    try {
        const [offers] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM offers'
        );
        return offers;

    } catch (err: any) {
        await connection.rollback();
        console.error('DB ERROR:', err);
        console.error('SQL Message:', err.sqlMessage);
        console.error('SQL State:', err.sqlState);
        console.error('Error Code:', err.code);
        throw err;
    } finally {
        connection.release();
    }

}

export const getOfferById = async (id: string) => {
    const connection = await conn.getConnection();
    try {
        const [offers] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM offers WHERE id=?',
            [id]
        )
        return offers[0];


    } catch (err: any) {
        await connection.rollback();
        console.error('DB ERROR:', err);
        console.error('SQL Message:', err.sqlMessage);
        console.error('SQL State:', err.sqlState);
        console.error('Error Code:', err.code);
        throw err;
    } finally {
        connection.release();
    }
}

export const updateOfferById = async (id: string,
    offerData: offerData) => {
    const connection = await conn.getConnection();
    try {
        const fields: string[] = [];
        const values: any[] = [];

        if (offerData.offer_name) {
            fields.push("offer_name = ?");
            values.push(offerData.offer_name);
        }

        if (offerData.description) {
            fields.push("description = ?");
            values.push(offerData.description);
        }

        if (offerData.discount_type) {
            fields.push("discount_type = ?");
            values.push(offerData.discount_type);
        }

        if (offerData.discount_value !== undefined && offerData.discount_value !== null) {
            fields.push("discount_value = ?");
            values.push(offerData.discount_value);
        }

        if (offerData.start_date) {
            fields.push("start_date = ?");
            values.push(offerData.start_date);
        }

        if (offerData.end_date) {
            fields.push("end_date = ?");
            values.push(offerData.end_date);
        }

        if (offerData.status) {
            fields.push("status = ?");
            values.push(offerData.status);
        }

        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        const query = `UPDATE offers SET ${fields.join(", ")} WHERE id = ?`;
        values.push(id);

        const [result]: any = await connection.execute(query, values);

        if (result.affectedRows === 0) {
            throw new Error("Offer not found");
        }

        const [rows]: any = await connection.execute(
            "SELECT  offer_name, description, discount_type, discount_value, start_date, end_date, status FROM offers WHERE id = ?",
            [id]
        );

        return rows[0];
    }
    catch (err: any) {
        await connection.rollback();
        console.error('DB ERROR:', err);
        console.error('SQL Message:', err.sqlMessage);
        console.error('SQL State:', err.sqlState);
        console.error('Error Code:', err.code);
        throw err;
    } finally {
        connection.release();
    }
}

export const deleteOfferById = async (id: string) => {
    const connection = await conn.getConnection();
    try {
        const [result] = await connection.query<ResultSetHeader>(
            "DELETE FROM offers WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Offer not found");
        }
    } catch (err: any) {
        await connection.rollback();
        console.error('DB ERROR:', err);
        console.error('SQL Message:', err.sqlMessage);
        console.error('SQL State:', err.sqlState);
        console.error('Error Code:', err.code);
        throw err;
    } finally {
        connection.release();
    }
}

export const getOfferBySearch = async (params: SearchEnquiryParams) => {
    const connection = await conn.getConnection();
    try {
        const { offer_name,
            discount_type,
            discount_value,
            start_date,
            end_date,
            status } = params;
        let query = 'SELECT * FROM offers WHERE 1=1';
        const values: any[] = [];
        if (offer_name) {
            query += " AND offer_name LIKE ?";
            values.push(`%${offer_name}%`);
        }
        if (discount_type) {
            query += ' AND discount_type = ?';
            values.push(discount_type);
        }
        if (discount_value !== undefined && discount_value !== null) {
            query += ' AND discount_value = ?';
            values.push(discount_value);
        }
        if (start_date !== undefined && start_date !== null) {
            query += ' AND start_date = ?';
            values.push(start_date);
        }
        if (end_date !== undefined && end_date !== null) {
            query += ' AND end_date = ?';
            values.push(end_date);
        }
        if (status) {
            query += ' AND status = ?';
            values.push(status);
        }

        const [enquires] = await connection.query<RowDataPacket[]>(query, values);
        console.log(enquires);
        return enquires;
    } catch (err: any) {
        console.error('DB ERROR:', err);
        console.error('SQL Message:', err.sqlMessage);
        console.error('SQL State:', err.sqlState);
        console.error('Error Code:', err.code);
        throw err;
    } finally {
        connection.release();
    }
}

export const activateOfferById = async (id: string) => {
    const connection = await conn.getConnection();

    try {
        const query = `UPDATE offers SET status = ? WHERE id = ?`;
        const [result]: any = await connection.execute(query, ["active", id]);

        if (result.affectedRows === 0) {
            throw new Error("Offer not found");
        }

        const [rows]: any = await connection.execute(
            "SELECT offer_name, status FROM offers WHERE id = ?",
            [id]
        );

        return rows[0];

    } catch (err: any) {
        console.error("DB ERROR:", err);
        throw err;

    } finally {
        connection.release();
    }
};

export const deactivateOfferById = async (id: string) => {
    const connection = await conn.getConnection();

    try {
        const query = `UPDATE offers SET status = ? WHERE id = ?`;
        const [result]: any = await connection.execute(query, ["inactive", id]);

        if (result.affectedRows === 0) {
            throw new Error("Offer not found");
        }

        const [rows]: any = await connection.execute(
            "SELECT offer_name, status FROM offers WHERE id = ?",
            [id]
        );

        return rows[0];

    } catch (err: any) {
        console.error("DB ERROR:", err);
        throw err;

    } finally {
        connection.release();
    }
}