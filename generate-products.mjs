import { faker } from '@faker-js/faker';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';


function generateProduct() {
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
  const sizes = ['S', 'M', 'L', 'XL', '2XL'];
  const categories = ['T-shirts', 'Hoodies', 'Pants', 'Shoes', 'Accessories'];
  const tags = ['Casual', 'Formal', 'Sport', 'Outdoor', 'Party'];

  const product = {
    name: faker.commerce.productName(),
    type: 'variable',
    regular_price: faker.commerce.price(),
    description: faker.lorem.paragraph(),
    short_description: faker.lorem.sentence(),
    categories: [faker.helpers.arrayElements(categories)],
    tags: [faker.helpers.arrayElements(tags)],
    attributes: [
      {
        name: 'Color',
        options: faker.helpers.arrayElements(colors, faker.datatype.number({ min: 1, max: colors.length })),
        visible: true
      },
      {
        name: 'Size',
        options: faker.helpers.arrayElements(sizes, faker.datatype.number({ min: 1, max: sizes.length })),
        visible: true
      }
    ]
  };

  return product;
}

function generateVariations(attributes) {
  const variations = [];

  for (const attribute of attributes) {
    for (const option of attribute.options) {
      const variation = {
        regular_price: faker.commerce.price(),
        attributes: [
          {
            id: attribute.id,
            option: option
          }
        ]
      };
      variations.push(variation);
    }
  }

  return variations;
}

function generateProducts(numProducts) {
  const products = [];

  for (let i = 0; i < numProducts; i++) {
    const product = generateProduct();
    const variations = generateVariations(product.attributes);
    product.variations = variations;
    products.push(product);
  }

  return products;
}

function saveToCsv(products) {
  const csvWriter = createCsvWriter({
    path: 'products.csv',
    header: [
      // Add any additional headers you need
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'type', title: 'Type' },
      { id: 'regular_price', title: 'Regular Price' },
      { id: 'description', title: 'Description' },
      { id: 'short_description', title: 'Short Description' },
      { id: 'categories', title: 'Categories' },
      { id: 'tags', title: 'Tags' }
    ]
  });

  csvWriter
    .writeRecords(products)
    .then(() => {
      console.log('Data saved to products.csv');
    })
    .catch(error => {
      console.error('Error writing to CSV:', error);
    });
}

(async () => {
  const numProducts = 1000; // Set the desired number of products
  const products = generateProducts(numProducts);
  console.log('All products created.');

  // Save the generated products to a CSV file
  saveToCsv(products);
})();
