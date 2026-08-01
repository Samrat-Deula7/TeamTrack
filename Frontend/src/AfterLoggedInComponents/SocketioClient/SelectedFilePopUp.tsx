type SelectedFileProps = {
  eachFile: any;
  id: number;
  selectFiles: object[];
  setSelectFiles: React.Dispatch<React.SetStateAction<object[]>>;
};

const SelectedFilePopUp: React.FC<SelectedFileProps> = ({
  eachFile,
  selectFiles,
  id,
  setSelectFiles,
}) => {
  return (
    <>
      <div
        className={`relative flex justify-center items-center  max-w-40 min-h-13 md:min-h-16 px-3 py-2 bg-[#101820] text-gray-300 rounded-tr-xl rounded-tl-xl ${eachFile.name != null ? "flex" : "hidden"}`}
      >
        <button
          onClick={() => {
            const filteredFile = selectFiles.filter((_, i) => i !== id);
            setSelectFiles(filteredFile);
          }}
          className="absolute -top-1 right-2 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
          aria-label="Close button"
        >
          &times;
        </button>
        <div className="text-[8px] md:text-xs" key={eachFile.name}>
          {" "}
          {eachFile?.name}
        </div>
      </div>
    </>
  );
};

export default SelectedFilePopUp;
