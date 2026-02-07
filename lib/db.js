import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* helper to check verification */
export async function getEmailVerification(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM email_verifications WHERE email = ? LIMIT 1",
    [email]
  );
    return rows.length ? rows[0] : null;
}

export default pool; // ✅ THIS LINE FIXES THE ERROR
