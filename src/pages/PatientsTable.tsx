import { useState, useMemo } from "react";
interface Patient {
	id: string;
	name: string;
	priority: number;
	status: "waiting" | "in-progress" | "done";
}
const patientsSeed: Patient[] = [
	{
		id: "1",
		name: "Alice",
		priority: 3,
		status: "done"
	},
	{
		id: "2",
		name: "Bob",
		priority: 1,
		status: "in-progress"
	},
	{
		id: "3",
		name: "Clara",
		priority: 2,
		status: "waiting"
	},
];


export default function PatientDashboard() {
	const [patients] = useState(patientsSeed);
	const [sortKey, setSortKey] = useState<"priority" | "name">("priority");
	const sortedPatients = useMemo(() => {
		return [...patients].sort((a, b) =>
			sortKey === "priority"
				? a.priority - b.priority
				: a.name.localeCompare(b.name)
		);
	}, [patients, sortKey]);
	return (
		<div className="p-4">
			<h1 className="text-xl font-bold">Patient Queue</h1>
			<select onChange={(e) => setSortKey(e.target.value as "priority" | "name")}>
				<option value="priority">Sort by Priority</option>
				<option value="name">Sort by Name</option>
			</select>
			<ul>
				{sortedPatients.map((p) => (
					<li
						key={p.id}
						className={`p-2 my-1 rounded ${p.status === "in-progress" ? "bg-yellow-200" : "bg-gray-100"
							}`}
					>
						{p.name} — {p.priority} ({p.status})
					</li>
				))}
			</ul>
		</div>
	);
}