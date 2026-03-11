export default function Input({ label, type = "text", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
        {...props}
      />
    </div>
  );
}
