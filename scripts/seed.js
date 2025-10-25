const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database'); // ajustá la ruta según tu proyecto

async function runSeeds() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Ruta al archivo init.sql
        const initSqlPath = path.join(__dirname, '../init.sql');

        if (!fs.existsSync(initSqlPath)) {
            console.log('⚠️ init.sql not found. No seed data loaded.');
            process.exit(0);
        }

        const initSql = fs.readFileSync(initSqlPath, 'utf8');

        // Separar en statements y ejecutar uno por uno
        const statements = initSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            try {
                console.log('🔹 Executing:', statement.slice(0, 50) + '...');
                await sequelize.query(statement);
            } catch (err) {
                console.log('ℹ️ Ignored statement error:', err.message);
            }
        }

        console.log('✅ Seed data loaded successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error loading seed data:', err);
        process.exit(1);
    }
}

runSeeds();
