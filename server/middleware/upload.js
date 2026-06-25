const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = [
    '.glb', '.gltf', '.stl', '.obj', '.step',
    '.pdf', '.jpg', '.jpeg', '.png', '.webp',
    '.xlsx', '.xls', '.csv',
  ]
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${ext} not allowed`), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
})

module.exports = upload
