// node src/database/generateFakeProducts.js

const { faker } = require('@faker-js/faker');
const fs = require('fs');

const records = [];

for (let i = 1; i <= 1000; i++) {
  records.push({
    id: i,
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    product: faker.commerce.product(),
    color: faker.color.human(),
    createdAt: faker.date.past().toISOString(),
    image: faker.image.urlPicsumPhotos(),
  });
}

fs.writeFileSync('products.json', JSON.stringify(records, null, 2));
console.log('Fake products generated successfully!');
