module.exports = {
  user: 'sqladmin',                     // SQL username
  password: 'Dco$ystem2025!',           // SQL password (case-sensitive)
  server: 'dcodbserver2025.database.windows.net', // From Azure portal
  database: 'DCO_DB',
  options: {
    encrypt: true                       // Required for Azure SQL
  }
};
