// JWT Configuration
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'veterinaria_mordisco_secret_key_2025',
  jwtExpiration: '24h'
};