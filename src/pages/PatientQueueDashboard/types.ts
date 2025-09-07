export interface Patient {
  id: string;
  name: string;
  priority: number;
  status: "waiting" | "in-progress" | "done";
}
