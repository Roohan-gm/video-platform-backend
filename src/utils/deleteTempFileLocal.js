import fs from "fs";

const deleteTempFileLocal = (localPath) => {
  if (localPath && fs.existsSync(localPath)) {
    fs.unlinkSync(localPath);
  }
};

export default deleteTempFileLocal;
