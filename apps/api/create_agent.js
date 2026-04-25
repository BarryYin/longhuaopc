const bcrypt = require('bcrypt');

async function createAgent() {
  const hash = await bcrypt.hash('test123456', 10);
  console.log('Password hash:', hash);
}

createAgent();
