require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')

const authRoutes = require('./routes/auth')
const customerRoutes = require('./routes/customers')
const invoiceRoutes = require('./routes/invoices')
const quotationRoutes = require('./routes/quotations')
const productRoutes = require('./routes/products')
const contactRoutes = require('./routes/contact')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Ensure upload directory exists ───
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// ─── Middleware ───
app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// CORS — allow client and admin origins
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

// Static files — serve uploaded files
app.use('/uploads', express.static(uploadDir))

// ─── Routes ───
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/quotations', quotationRoutes)
app.use('/api/products', productRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Global error handler ───
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  const status = err.statusCode || 500
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

// ─── Start ───
app.listen(PORT, () => {
  console.log(`\n  ⚡ KRIXTRON API running on http://localhost:${PORT}`)
  console.log(`  📦 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})

module.exports = app
