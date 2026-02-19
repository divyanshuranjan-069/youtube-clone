export default function Shimmer() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-48 rounded-xl"></div>
      <div className="bg-gray-300 h-4 mt-2 w-3/4"></div>
      <div className="bg-gray-300 h-4 mt-1 w-1/2"></div>
    </div>
  );
}