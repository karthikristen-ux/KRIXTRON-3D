// Mock data for admin panel UI development
// Will be replaced with API calls in production

export const MOCK_CUSTOMERS = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@techbuild.com', phone: '+91 98765 43210', company: 'TechBuild Labs', address: 'Mumbai, MH', notes: 'Regular client - bulk orders', createdAt: '2024-01-15' },
  { id: '2', name: 'Priya Nair', email: 'priya@archivision.in', phone: '+91 87654 32109', company: 'ArchiVision Studio', address: 'Bangalore, KA', notes: 'Architectural models', createdAt: '2024-02-20' },
  { id: '3', name: 'Vikram Patel', email: 'vikram@roboworks.io', phone: '+91 76543 21098', company: 'RoboWorks India', address: 'Pune, MH', notes: 'Robot parts - Nylon PA12', createdAt: '2024-03-10' },
  { id: '4', name: 'Ananya Desai', email: 'ananya@meditech.co', phone: '+91 65432 10987', company: 'MediTech Solutions', address: 'Hyderabad, TS', notes: 'Medical device housings', createdAt: '2024-04-05' },
  { id: '5', name: 'Karthik Reddy', email: 'karthik@droneforce.in', phone: '+91 54321 09876', company: 'DroneForce', address: 'Chennai, TN', notes: 'Drone frames - carbon nylon', createdAt: '2024-05-12' },
  { id: '6', name: 'Sneha Gupta', email: 'sneha@designhub.com', phone: '+91 43210 98765', company: 'DesignHub Creative', address: 'Delhi, DL', notes: 'Art installations', createdAt: '2024-06-01' },
]

export const MOCK_INVOICES = [
  { id: '1', invoiceNo: 'KRX-2024-001', customer: MOCK_CUSTOMERS[0], items: [{ description: 'Precision Gear Set (x5)', quantity: 5, unitPrice: 2500, total: 12500 }], subtotal: 12500, tax: 18, totalAmount: 14750, status: 'PAID', dueDate: '2024-02-15', paidAt: '2024-02-10', createdAt: '2024-01-20' },
  { id: '2', invoiceNo: 'KRX-2024-002', customer: MOCK_CUSTOMERS[1], items: [{ description: 'Architectural Scale Model', quantity: 1, unitPrice: 4200, total: 4200 }, { description: 'Display Base', quantity: 1, unitPrice: 800, total: 800 }], subtotal: 5000, tax: 18, totalAmount: 5900, status: 'PAID', dueDate: '2024-03-15', paidAt: '2024-03-12', createdAt: '2024-02-25' },
  { id: '3', invoiceNo: 'KRX-2024-003', customer: MOCK_CUSTOMERS[2], items: [{ description: 'Robot Joint Assembly', quantity: 10, unitPrice: 1800, total: 18000 }], subtotal: 18000, tax: 18, totalAmount: 21240, status: 'PENDING', dueDate: '2024-07-15', createdAt: '2024-06-10' },
  { id: '4', invoiceNo: 'KRX-2024-004', customer: MOCK_CUSTOMERS[3], items: [{ description: 'Medical Device Housing (Type A)', quantity: 3, unitPrice: 3500, total: 10500 }], subtotal: 10500, tax: 18, totalAmount: 12390, status: 'OVERDUE', dueDate: '2024-05-01', createdAt: '2024-04-10' },
  { id: '5', invoiceNo: 'KRX-2024-005', customer: MOCK_CUSTOMERS[4], items: [{ description: 'Drone Frame v2', quantity: 8, unitPrice: 5600, total: 44800 }], subtotal: 44800, tax: 18, totalAmount: 52864, status: 'PAID', dueDate: '2024-06-30', paidAt: '2024-06-25', createdAt: '2024-05-20' },
  { id: '6', invoiceNo: 'KRX-2024-006', customer: MOCK_CUSTOMERS[5], items: [{ description: 'Art Installation Piece', quantity: 2, unitPrice: 8500, total: 17000 }], subtotal: 17000, tax: 18, totalAmount: 20060, status: 'PENDING', dueDate: '2024-08-01', createdAt: '2024-06-15' },
]

export const MOCK_QUOTATIONS = [
  { id: '1', quoteNo: 'QT-2024-001', customer: MOCK_CUSTOMERS[0], items: [{ description: 'Custom Enclosure Set', quantity: 20, unitPrice: 1500, total: 30000 }], totalAmount: 30000, validUntil: '2024-08-01', status: 'SENT', createdAt: '2024-06-10' },
  { id: '2', quoteNo: 'QT-2024-002', customer: MOCK_CUSTOMERS[2], items: [{ description: 'Robot Arm Assembly', quantity: 4, unitPrice: 12000, total: 48000 }], totalAmount: 48000, validUntil: '2024-07-15', status: 'ACCEPTED', createdAt: '2024-06-05' },
  { id: '3', quoteNo: 'QT-2024-003', customer: MOCK_CUSTOMERS[4], items: [{ description: 'Drone Frame v3 Prototype', quantity: 2, unitPrice: 7500, total: 15000 }], totalAmount: 15000, validUntil: '2024-07-20', status: 'DRAFT', createdAt: '2024-06-18' },
  { id: '4', quoteNo: 'QT-2024-004', customer: MOCK_CUSTOMERS[1], items: [{ description: 'Building Model — Phase 2', quantity: 1, unitPrice: 18000, total: 18000 }], totalAmount: 18000, validUntil: '2024-08-10', status: 'REJECTED', createdAt: '2024-06-12' },
]

export const MOCK_PRODUCTS = [
  { id: '1', name: 'Precision Gear Assembly', description: 'High-strength interlocking gear set', material: 'Nylon PA12', price: 2500, isActive: true, createdAt: '2024-01-10' },
  { id: '2', name: 'Architectural Scale Model', description: 'Detailed building model at 1:100 scale', material: 'PLA White', price: 4200, isActive: true, createdAt: '2024-02-15' },
  { id: '3', name: 'Wireframe Sphere', description: 'Decorative geodesic sphere', material: 'PETG Clear', price: 1800, isActive: true, createdAt: '2024-03-01' },
  { id: '4', name: 'Custom Enclosure', description: 'Electronics housing with snap-fit lid', material: 'ABS Black', price: 3100, isActive: true, createdAt: '2024-03-20' },
  { id: '5', name: 'Turbine Blade', description: 'Optimized airfoil design for testing', material: 'Resin Grey', price: 5600, isActive: false, createdAt: '2024-04-10' },
  { id: '6', name: 'Robot Joint', description: 'Ball-socket joint with integrated bearing', material: 'TPU Flex', price: 2900, isActive: true, createdAt: '2024-05-05' },
]

// Dashboard stats
export const MOCK_STATS = {
  totalRevenue: 127204,
  pendingInvoices: 2,
  totalCustomers: 6,
  totalProducts: 6,
  monthlyRevenue: [
    { month: 'Jan', revenue: 14750 },
    { month: 'Feb', revenue: 5900 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 12390 },
    { month: 'May', revenue: 52864 },
    { month: 'Jun', revenue: 41300 },
  ],
  invoicesByStatus: [
    { name: 'Paid', value: 3, color: '#10b981' },
    { name: 'Pending', value: 2, color: '#f59e0b' },
    { name: 'Overdue', value: 1, color: '#ef4444' },
  ],
}
