import multer from "multer";
import path from "path";

const Multer = (dest: string) => {

  let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,dest)
    },
    filename: (req, file, callback) => {
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  let multerEnh = multer({
    storage: storage,
    limits: {

    },
    fileFilter: (req, file, callback) => {
      checkFileType(file,callback)
  }
  })
  return multerEnh;
}

function checkFileType(file: any, callback: any) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp3|mp4/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return callback(null,true);
  } else {
    callback('Error: Images or Videos Only!');
  }
}

export default Multer;