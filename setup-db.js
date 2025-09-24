const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
    try {
        console.log('🔧 Setting up database...');
        
        // Create siswa table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS siswa (
                id SERIAL PRIMARY KEY,
                nama VARCHAR(255) NOT NULL,
                kelas VARCHAR(50) NOT NULL,
                pesan TEXT,
                tanggal_kunjungan DATE,
                foto VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created siswa table');

        // Create umum table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS umum (
                id SERIAL PRIMARY KEY,
                nama VARCHAR(255) NOT NULL,
                nama_instansi VARCHAR(255) NOT NULL,
                pesan TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created umum table');

        // Insert sample data
        await pool.query(`
            INSERT INTO siswa (nama, kelas, pesan, tanggal_kunjungan) VALUES
            ('John Doe', '12-PPLG-1', 'Senang bisa hadir di acara BIA 2025', '2025-09-25'),
            ('Jane Smith', '11-TJKT-2', 'Acara yang sangat menarik!', '2025-09-26')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ Inserted sample siswa data');

        await pool.query(`
            INSERT INTO umum (nama, nama_instansi, pesan) VALUES
            ('Dr. Ahmad', 'Universitas Indonesia', 'Acara yang sangat bermanfaat untuk inovasi'),
            ('PT. Tech Solutions', 'PT. Tech Solutions', 'Mendukung inovasi di Kota Bogor')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ Inserted sample umum data');

        // Check tables
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('📋 Available tables:', tables.rows.map(r => r.table_name));

        // Check data count
        const siswaCount = await pool.query('SELECT COUNT(*) FROM siswa');
        const umumCount = await pool.query('SELECT COUNT(*) FROM umum');
        console.log(`📊 Data count - Siswa: ${siswaCount.rows[0].count}, Umum: ${umumCount.rows[0].count}`);

        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await pool.end();
    }
}

setupDatabase();
