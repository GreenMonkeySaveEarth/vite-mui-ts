import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListUsers from './index';

describe('ListUsers Component', () => {
	// Test case-sensitive sorting by lastName
	test('sorts users by lastName case-sensitively', () => {
		// Test data with mixed case last names
		const testUsers = [
			{ firstName: 'John', lastName: 'smith' },     // lowercase 's'
			{ firstName: 'Jane', lastName: 'Smith' },     // uppercase 'S'
			{ firstName: 'Alice', lastName: 'JOHNSON' },  // all uppercase
			{ firstName: 'Bob', lastName: 'johnson' },    // all lowercase
			{ firstName: 'Carol', lastName: 'Anderson' }, // mixed case
			{ firstName: 'Dave', lastName: 'anderson' },  // lowercase 'a'
		];

		render(<ListUsers users={testUsers} />);

		// Get all list items
		const listItems = screen.getAllByRole('listitem');

		// Since we have 6 users and page size is 5, we should see the first 5 users
		// In case-sensitive sort order, uppercase comes before lowercase in ASCII/Unicode
		// Expected order: Anderson, JOHNSON, Smith, anderson, johnson, smith
		expect(listItems).toHaveLength(5);

		// Check first page items (first 5)
		expect(listItems[0]).toHaveTextContent('Anderson, Carol');
		expect(listItems[1]).toHaveTextContent('JOHNSON, Alice');
		expect(listItems[2]).toHaveTextContent('Smith, Jane');
		expect(listItems[3]).toHaveTextContent('anderson, Dave');
		expect(listItems[4]).toHaveTextContent('johnson, Bob');

		// Go to next page to see the last user
		const nextButton = screen.getByTestId('button-next');
		userEvent.click(nextButton);

		// Check that the last user is visible on the second page
		const updatedListItems = screen.getAllByRole('listitem');
		expect(updatedListItems).toHaveLength(1);
		expect(updatedListItems[0]).toHaveTextContent('smith, John');
	});

	// Test that original order is preserved when last names are identical
	test('preserves original order when lastName is the same', () => {
		const testUsers = [
			{ firstName: 'John', lastName: 'Smith' },
			{ firstName: 'Jane', lastName: 'Smith' },
			{ firstName: 'Mark', lastName: 'Smith' },
			{ firstName: 'Sarah', lastName: 'Johnson' },
			{ firstName: 'David', lastName: 'Johnson' },
		];

		render(<ListUsers users={testUsers} />);

		const listItems = screen.getAllByRole('listitem');

		// Johnson entries should be in original order (Sarah before David)
		expect(listItems[0]).toHaveTextContent('Johnson, Sarah');
		expect(listItems[1]).toHaveTextContent('Johnson, David');

		// Smith entries should be in original order (John, Jane, Mark)
		expect(listItems[2]).toHaveTextContent('Smith, John');
		expect(listItems[3]).toHaveTextContent('Smith, Jane');
		expect(listItems[4]).toHaveTextContent('Smith, Mark');
	});

	// Test with empty users array
	test('shows "User Zero" when no users are provided', () => {
		render(<ListUsers users={[]} />);
		expect(screen.getByText('User Zero')).toBeInTheDocument();
		expect(screen.queryByTestId('users-list')).not.toBeInTheDocument();
	});
});