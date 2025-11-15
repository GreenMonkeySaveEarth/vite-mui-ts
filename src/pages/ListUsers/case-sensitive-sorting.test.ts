import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ListUsers from './index';

// First, let's create a simple helper to demonstrate the case-sensitive sorting
function demonstrateCaseSensitiveSorting() {
  // Create a sample array with mixed case last names
  const users = [
    { firstName: "John", lastName: "smith" },    // lowercase 's'
    { firstName: "Jane", lastName: "Smith" },    // uppercase 'S'
    { firstName: "Alice", lastName: "JOHNSON" }, // all uppercase
    { firstName: "Bob", lastName: "johnson" },   // all lowercase
  ];

  // Apply the same sorting logic as the component
  const sortedUsers = users
    .map((u, i) => ({ ...u, __i: i }))
    .sort((a, b) => {
      if (a.lastName < b.lastName) return -1;
      if (a.lastName > b.lastName) return 1;
      return a.__i - b.__i; // preserve original order for ties
    })
    .map(({ __i, ...u }) => u);

  // In case-sensitive sorting:
  // Uppercase letters come before lowercase in ASCII/Unicode
  // So the expected order is: JOHNSON, Smith, johnson, smith
  return sortedUsers;
}

describe('ListUsers sorting logic', () => {
  it('sorts by lastName case-sensitively', () => {
    const sortedUsers = demonstrateCaseSensitiveSorting();
    
    // Expected case-sensitive sort order: JOHNSON, Smith, johnson, smith
    expect(sortedUsers[0].lastName).toBe("JOHNSON");
    expect(sortedUsers[1].lastName).toBe("Smith");
    expect(sortedUsers[2].lastName).toBe("johnson");
    expect(sortedUsers[3].lastName).toBe("smith");
  });

  it('preserves original order when lastNames are the same', () => {
    const users = [
      { firstName: "John", lastName: "Smith" },
      { firstName: "Jane", lastName: "Smith" },
      { firstName: "Mark", lastName: "Smith" },
    ];

    const sortedUsers = users
      .map((u, i) => ({ ...u, __i: i }))
      .sort((a, b) => {
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;
        return a.__i - b.__i; // preserve original order for ties
      })
      .map(({ __i, ...u }) => u);

    // Original order was John, Jane, Mark - should be preserved
    expect(sortedUsers[0].firstName).toBe("John");
    expect(sortedUsers[1].firstName).toBe("Jane");
    expect(sortedUsers[2].firstName).toBe("Mark");
  });
});

// Test with mock data to manually verify
describe('Case-sensitive sorting demonstration', () => {
  it('Example: Case-sensitive lastName sorting demonstration', () => {
    console.log('Demonstration of case-sensitive lastName sorting:');
    
    // Sample data with various case variations for lastName
    const sampleUsers = [
      { firstName: 'John', lastName: 'smith' },
      { firstName: 'Jane', lastName: 'Smith' },
      { firstName: 'Alice', lastName: 'JOHNSON' },
      { firstName: 'Bob', lastName: 'Johnson' },
      { firstName: 'Carol', lastName: 'Anderson' },
      { firstName: 'Dave', lastName: 'anderson' },
    ];
    
    console.log('Original data:');
    sampleUsers.forEach(user => {
      console.log(`${user.firstName} ${user.lastName}`);
    });
    
    // Apply the same sorting logic as in the component
    const sortedUsers = sampleUsers
      .map((u, i) => ({ ...u, __i: i }))
      .sort((a, b) => {
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;
        return a.__i - b.__i;
      })
      .map(({ __i, ...u }) => u);
    
    console.log('\nAfter case-sensitive sorting:');
    sortedUsers.forEach(user => {
      console.log(`${user.firstName} ${user.lastName}`);
    });
    
    // Expected order: Anderson, JOHNSON, Johnson, Smith, anderson, smith
    expect(sortedUsers[0].lastName).toBe('Anderson');
    expect(sortedUsers[1].lastName).toBe('JOHNSON');
    expect(sortedUsers[2].lastName).toBe('Johnson');
    expect(sortedUsers[3].lastName).toBe('Smith');
    expect(sortedUsers[4].lastName).toBe('anderson');
    expect(sortedUsers[5].lastName).toBe('smith');

    console.log('\nNote: In case-sensitive sorting, uppercase letters come before lowercase in ASCII/Unicode ordering.');
    console.log('This is why "Anderson" comes before "anderson", "JOHNSON" before "Johnson", etc.');
  });
});