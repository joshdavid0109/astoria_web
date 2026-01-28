const LoadingOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
