import fs from 'fs';

const deleteTempFileLocal = (localPath) => {
  try {
    fs.unlinkSync(localPath);
  } catch (err) {
    // optional: log, but don’t crash the request
    console.error('Failed to delete temp file:', localPath, err);
  }
};

export default deleteTempFileLocal;