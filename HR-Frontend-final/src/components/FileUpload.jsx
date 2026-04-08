const FileUpload = ({ label }) => {
  return (
    <div className="border rounded p-3">

      <label className="font-medium">{label}</label>

      <div className="flex gap-3 mt-2">

        <button className="bg-gray-200 px-3 py-1 rounded">
          Desktop
        </button>

        <button className="bg-gray-200 px-3 py-1 rounded">
          WorkDrive
        </button>

        <button className="bg-gray-200 px-3 py-1 rounded">
          Others
        </button>

      </div>

      <p className="text-xs text-gray-400 mt-2">
        Files supported: JPG, PNG, GIF, JPEG — Max size 5MB
      </p>

    </div>
  );
};

export default FileUpload;


