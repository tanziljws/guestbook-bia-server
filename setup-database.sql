-- Database setup script for Guestbook BIA
-- Run this script to create the required tables

-- Create siswa table
CREATE TABLE IF NOT EXISTS siswa (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    pesan TEXT,
    tanggal_kunjungan DATE,
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create umum table
CREATE TABLE IF NOT EXISTS umum (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nama_instansi VARCHAR(255) NOT NULL,
    pesan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data for testing
INSERT INTO siswa (nama, kelas, pesan, tanggal_kunjungan) VALUES
('John Doe', '12-PPLG-1', 'Senang bisa hadir di acara BIA 2025', '2025-09-25'),
('Jane Smith', '11-TJKT-2', 'Acara yang sangat menarik!', '2025-09-26')
ON CONFLICT DO NOTHING;

INSERT INTO umum (nama, nama_instansi, pesan) VALUES
('Dr. Ahmad', 'Universitas Indonesia', 'Acara yang sangat bermanfaat untuk inovasi'),
('PT. Tech Solutions', 'PT. Tech Solutions', 'Mendukung inovasi di Kota Bogor')
ON CONFLICT DO NOTHING;

-- Show tables
\dt
