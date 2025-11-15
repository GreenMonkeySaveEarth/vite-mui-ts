import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * ListUsers
 * Props:
 *  - users?: Array<{ firstName: string; lastName: string }>
 *
 * Behavior:
 *  - Sorts by lastName alphabetically (case-sensitive); if last names are equal, keeps original order.
 *  - Paginates 5 users per page with Previous/Next buttons.
 *  - If users is empty or omitted, shows "User Zero" and no list.
 *
 * NOTE: Keeps data-testid attributes on the <ul> and <button> elements.
 */
export default function ListUsers({ users = [] }) {
	const PAGE_SIZE = 5;
	const [page, setPage] = useState(1);

	// Reset to first page whenever the users prop changes
	useEffect(() => {
		setPage(1);
	}, [users]);

	const sortedUsers = useMemo(() => {
		if (!Array.isArray(users)) return [];
		// Stable sort by lastName (case-sensitive). When equal, keep original order.
		return users
			.map((u, i) => ({ ...u, __i: i }))
			.sort((a, b) => {
				if (a.lastName < b.lastName) return -1;
				if (a.lastName > b.lastName) return 1;
				return a.__i - b.__i; // preserve original order for ties
			})
			.map(({ __i, ...u }) => u);
	}, [users]);

	if (!sortedUsers.length) {
		return (
			<div>
				<p>User Zero</p>
			</div>
		);
	}

	const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const visible = sortedUsers.slice(startIndex, startIndex + PAGE_SIZE);

	const canPrev = currentPage > 1;
	const canNext = currentPage < totalPages;

	const goPrev = () => {
		if (canPrev) setPage((p) => p - 1);
	};

	const goNext = () => {
		if (canNext) setPage((p) => p + 1);
	};

	return (
		<div>
			<ul data-testid="users-list">
				{visible.map((u, idx) => (
					<li key={`${startIndex + idx}-${u.lastName}-${u.firstName}`}>
						{u.lastName}, {u.firstName}
					</li>
				))}
			</ul>

			<div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
				<button
					type="button"
					onClick={goPrev}
					disabled={!canPrev}
					data-testid="button-prev"
					aria-label="Previous page"
				>
					Previous
				</button>
				<span aria-live="polite">
					Page {currentPage} of {totalPages}
				</span>
				<button
					type="button"
					onClick={goNext}
					disabled={!canNext}
					data-testid="button-next"
					aria-label="Next page"
				>
					Next
				</button>
			</div>
		</div>
	);
}

ListUsers.propTypes = {
	users: PropTypes.arrayOf(
		PropTypes.shape({
			lastName: PropTypes.string.isRequired,
			firstName: PropTypes.string.isRequired,
		})
	),
};
