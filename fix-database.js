const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixDatabase() {
    try {
        console.log('🔧 Fixing database schema...');
        
        // Check if foto column exists and its constraints
        const fotoColumn = await pool.query(`
            SELECT column_name, is_nullable, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'siswa' AND column_name = 'foto'
        `);
        
        if (fotoColumn.rows.length > 0) {
            console.log('📋 Foto column info:', fotoColumn.rows[0]);
            
            // If foto column is NOT NULL, make it nullable
            if (fotoColumn.rows[0].is_nullable === 'NO') {
                await pool.query('ALTER TABLE siswa ALTER COLUMN foto DROP NOT NULL');
                console.log('✅ Made foto column nullable');
            }
        } else {
            // Add foto column if it doesn't exist
            await pool.query('ALTER TABLE siswa ADD COLUMN foto VARCHAR(255)');
            console.log('✅ Added foto column');
        }

        // Check if created_at column exists
        const createdAtColumn = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'siswa' AND column_name = 'created_at'
        `);
        
        if (createdAtColumn.rows.length === 0) {
            await pool.query('ALTER TABLE siswa ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
            console.log('✅ Added created_at column to siswa');
        }

        // Check umum table
        const umumCreatedAtColumn = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'umum' AND column_name = 'created_at'
        `);
        
        if (umumCreatedAtColumn.rows.length === 0) {
            await pool.query('ALTER TABLE umum ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
            console.log('✅ Added created_at column to umum');
        }

        // Clear existing data to avoid conflicts
        await pool.query('DELETE FROM siswa');
        await pool.query('DELETE FROM umum');
        console.log('✅ Cleared existing data');

        // Insert sample data
        await pool.query(`
            INSERT INTO siswa (nama, kelas, pesan, tanggal_kunjungan) VALUES
            ('John Doe', '12-PPLG-1', 'Senang bisa hadir di acara BIA 2025', '2025-09-25'),
            ('Jane Smith', '11-TJKT-2', 'Acara yang sangat menarik!', '2025-09-26')
        `);
        console.log('✅ Inserted sample siswa data');

        await pool.query(`
            INSERT INTO umum (nama, nama_instansi, pesan) VALUES
            ('Dr. Ahmad', 'Universitas Indonesia', 'Acara yang sangat bermanfaat untuk inovasi'),
            ('PT. Tech Solutions', 'PT. Tech Solutions', 'Mendukung inovasi di Kota Bogor')
        `);
        console.log('✅ Inserted sample umum data');

        // Check final schema
        const siswaSchema = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'siswa' 
            ORDER BY ordinal_position
        `);
        console.log('📋 Siswa table schema:', siswaSchema.rows);

        const umumSchema = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'umum' 
            ORDER BY ordinal_position
        `);
        console.log('📋 Umum table schema:', umumSchema.rows);

        // Check data count
        const siswaCount = await pool.query('SELECT COUNT(*) FROM siswa');
        const umumCount = await pool.query('SELECT COUNT(*) FROM umum');
        console.log(`📊 Data count - Siswa: ${siswaCount.rows[0].count}, Umum: ${umumCount.rows[0].count}`);

        console.log('🎉 Database fix completed successfully!');
        
    } catch (error) {
        console.error('❌ Database fix failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await pool.end();
    }
}

fixDatabase();
