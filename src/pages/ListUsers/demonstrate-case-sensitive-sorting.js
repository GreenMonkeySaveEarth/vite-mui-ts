/**
 * Case-Sensitive Sorting Test for ListUsers Component
 * 
 * This file demonstrates how the case-sensitive sorting works
 * in the ListUsers component. You can run this file directly
 * with Node.js to see the sorting behavior.
 */

// Sample data with mixed case last names to test sorting
const sampleUsers = [
  { firstName: 'John', lastName: 'smith' },    // lowercase 's'
  { firstName: 'Jane', lastName: 'Smith' },    // uppercase 'S'
  { firstName: 'Alice', lastName: 'JOHNSON' }, // all uppercase
  { firstName: 'Bob', lastName: 'Johnson' },   // mixed case
  { firstName: 'Carol', lastName: 'Anderson' }, // mixed case
  { firstName: 'Dave', lastName: 'anderson' },  // lowercase 'a'
];

console.log('=== Case-Sensitive LastName Sorting Demonstration ===');
console.log('\nOriginal data:');
sampleUsers.forEach(user => {
  console.log(`${user.firstName} ${user.lastName}`);
});

// Apply the same sorting logic as in the ListUsers component
const sortedUsers = sampleUsers
  .map((u, i) => ({ ...u, __i: i }))
  .sort((a, b) => {
    if (a.lastName < b.lastName) return -1;
    if (a.lastName > b.lastName) return 1;
    return a.__i - b.__i; // preserve original order for ties
  })
  .map(({ __i, ...u }) => u);

console.log('\nAfter case-sensitive sorting:');
sortedUsers.forEach(user => {
  console.log(`${user.firstName} ${user.lastName}`);
});

// Test same last name sorting
console.log('\n=== Same LastName Sorting Demonstration ===');
const sameLastNameUsers = [
  { firstName: 'John', lastName: 'Smith' },
  { firstName: 'Jane', lastName: 'Smith' },
  { firstName: 'Mark', lastName: 'Smith' },
];

console.log('\nOriginal data with same last names:');
sameLastNameUsers.forEach(user => {
  console.log(`${user.firstName} ${user.lastName}`);
});

const sortedSameLastNameUsers = sameLastNameUsers
  .map((u, i) => ({ ...u, __i: i }))
  .sort((a, b) => {
    if (a.lastName < b.lastName) return -1;
    if (a.lastName > b.lastName) return 1;
    return a.__i - b.__i; // preserve original order for ties
  })
  .map(({ __i, ...u }) => u);

console.log('\nAfter sorting (original order preserved for same last names):');
sortedSameLastNameUsers.forEach(user => {
  console.log(`${user.firstName} ${user.lastName}`);
});

console.log('\n=== Explanation ===');
console.log('1. In case-sensitive sorting, uppercase letters come before lowercase in ASCII/Unicode ordering.');
console.log('   This is why "Anderson" comes before "anderson", "JOHNSON" before "Johnson", etc.');
console.log('\n2. When last names are identical, the original order is preserved.');
console.log('   This is accomplished by storing the original indices before sorting,');
console.log('   and then using those indices as a tiebreaker when last names are equal.');

// Verify the order is correct
function verifyOrder() {
  let isCorrect = true;
  
  // Expected order: Anderson, JOHNSON, Johnson, Smith, anderson, smith
  const expectedOrder = ['Anderson', 'JOHNSON', 'Johnson', 'Smith', 'anderson', 'smith'];
  
  for (let i = 0; i < sortedUsers.length; i++) {
    if (sortedUsers[i].lastName !== expectedOrder[i]) {
      isCorrect = false;
      console.log(`\nError: Expected "${expectedOrder[i]}" at position ${i}, but got "${sortedUsers[i].lastName}"`);
    }
  }
  
  if (isCorrect) {
    console.log('\n✅ Case-sensitive sorting verified: Order is correct!');
  } else {
    console.log('\n❌ Case-sensitive sorting test failed: Order is incorrect.');
  }
}

verifyOrder();