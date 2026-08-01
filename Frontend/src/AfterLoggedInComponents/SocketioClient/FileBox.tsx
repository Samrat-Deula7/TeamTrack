type FileBoxProp = {
  openFile: boolean;
  setOpenFile: React.Dispatch<React.SetStateAction<boolean>>;
  selectFiles: object[];
  setSelectFiles: React.Dispatch<React.SetStateAction<object[]>>;
};
const FileBox: React.FC<FileBoxProp> = ({
  openFile,
  setOpenFile,
  selectFiles,
  setSelectFiles,
}) => {
  return (
    <>
      <div
        className={`absolute z-6 bottom-15 md:left-13 items-center justify-center  w-50 h-30 md:w-80 md:h-40 md:h-[]  bg-[#101820] backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${openFile ? "flex" : "hidden"}`}
      >
        <button
          onClick={() => {
            setOpenFile(false);
          }}
          className="absolute top-0 right-2 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
          aria-label="Close button"
        >
          &times;
        </button>
        <label
          htmlFor="FileUpload"
          className="border rounded-full  p-2 border-green-500 text-green-500 cursor-pointer hover:border-0"
        >
          Upload File
        </label>
        <input
          id="FileUpload"
          type="file"
          className="hidden"
          onChange={(e: any) => {
            const files = e.target.files;
            const fileArray = Array.from(files) as object[];
            if (fileArray) {
              setSelectFiles([...selectFiles, ...fileArray!]);
              setOpenFile(false);
            }
          }}
        />
      </div>
    </>
  );
};

export default FileBox;
