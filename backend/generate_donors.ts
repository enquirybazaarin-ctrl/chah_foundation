import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Amit', 'Neha', 'Priya', 'Sneha', 'Rahul', 'Vikram', 'Pooja', 'Anjali', 'Karan', 'Arjun', 'Ravi'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Jain', 'Das', 'Reddy', 'Rao', 'Chauhan', 'Yadav'];
const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'];

async function main() {
  console.log('Generating 50 dummy donors...');
  let count = 0;
  for (let i = 1; i <= 50; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    await prisma.donor.create({
      data: {
        donor_number: `DNR-DUMMY-${Date.now()}-${i}`,
        first_name: fn,
        last_name: ln,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@dummy.com`,
        phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        city: city,
        status: 'ACTIVE'
      }
    });
    count++;
  }
  console.log(`${count} dummy donors created successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
