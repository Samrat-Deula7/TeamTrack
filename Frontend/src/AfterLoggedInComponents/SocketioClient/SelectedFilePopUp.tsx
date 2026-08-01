import Document from "../../assets/document.png";
import FileMedia from "../../assets/file-media.png";

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
  let type = eachFile.type;
  return (
    <>
      <div
        className={`relative z-5 flex justify-center items-center  max-w-40 min-h-13 md:min-h-16 px-3 py-2 bg-[#101820] text-gray-300 rounded-tr-xl rounded-tl-xl ${eachFile.name != null ? "flex" : "hidden"}`}
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
        <div
          className="text-[8px] md:text-xs flex flex-col justify-center items-center text-center"
          key={eachFile.name}
        >
          {type === "image/jpeg" ||
          type === "image/png" ||
          type === "image/gif" ||
          type === "image/webp" ||
          type === "image/bmp" ||
          type === "image/tiff" ||
          type === "image/svg+xml" ? (
            <img
              src={URL.createObjectURL(eachFile)}
              alt="preview"
              className="w-10"
            />
          ) : type === "video/mp4" ||
            type === "video/mp3" ||
            type === "video/webm" ||
            type === "video/ogg" ||
            type === "video/mpeg" ||
            type === "video/quicktime" ||
            type === "video/x-msvideo" ||
            type === "video/x-ms-wmv" ||
            type === "video/x-flv" ||
            type === "video/3gpp" ||
            type === "video/3gpp2" ||
            type === "video/x-matroska" ? (
            <img
              src={FileMedia}
              alt="file media"
              className="w-10 bg-white rounded-xl"
            />
          ) : (
            <img
              src={Document}
              alt="document"
              className="w-10 bg-white rounded-xl"
            />
          )}

          <div className="wrap-break-word w-20"> {eachFile?.name}</div>
        </div>
      </div>
    </>
  );
};

export default SelectedFilePopUp;
