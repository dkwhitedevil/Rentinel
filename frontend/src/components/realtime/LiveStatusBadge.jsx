export default function LiveStatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-200",
    responded: "bg-green-200",
    rejected: "bg-red-200",
    ghosted: "bg-purple-300",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-bold border-2 border-[#002040] w-fit ${styles[status] || "bg-gray-200"}`}
    >
      {(status || "pending").toUpperCase()}
    </span>
  );
}
