# Weekly Payment Management Application

A comprehensive full-stack application for managing weekly payment schedules with both admin and customer portals.

## 🚀 Features

### Admin Portal
- **Dashboard**: Complete overview with statistics and analytics
- **Customer Management**: Add, edit, delete customers with payment schedules
- **Payment Tracking**: Mark payments as paid/due/missed with automatic date tracking
- **Export Reports**: Generate Excel/PDF reports for daily, weekly, monthly, yearly periods
- **Search & Filter**: Advanced filtering by status, name, phone number
- **WhatsApp Integration**: Send payment receipts via WhatsApp

### Customer Portal
- **Payment Dashboard**: View personal payment schedule and progress
- **Multi-Account Support**: Handle multiple loan accounts per phone number
- **Payment History**: Track all payments with dates and status
- **Progress Tracking**: Visual progress indicators

### Key Features
- **Bilingual Support**: English and Telugu language support
- **Responsive Design**: Mobile-first design with modern UI
- **Real-time Updates**: Instant updates without page refresh
- **Smart Notifications**: Toast notifications for all actions
- **Data Export**: Excel and PDF export with customizable date ranges
- **Payment Date Tracking**: Automatic tracking of when payments were actually made

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React i18next** for internationalization
- **Lucide React** for icons
- **XLSX & jsPDF** for export functionality

### Backend
- **Java 17** with Spring Boot 3.2
- **Spring Security** for authentication
- **Spring Data JPA** with Hibernate
- **MySQL 8.0** database
- **Maven** for dependency management

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create MySQL database
mysql -u root -p
CREATE DATABASE weekly_payment_db;

# Update database credentials in application.properties
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Build and run
mvn clean install
mvn spring-boot:run
```

## 🔐 Default Credentials

### Admin Login
- **Phone**: 7815981315
- **Password**: Phk@1234

### Customer Login
- **Phone**: Any phone number added by admin (no password required)

## 📊 Database Schema

### Tables
1. **admins** - Admin authentication
2. **customers** - Customer information and loan details
3. **payments** - Weekly payment records with paid date tracking

### Key Features
- Automatic weekly payment generation (10 weeks)
- Payment status tracking with actual paid dates
- Customer can have multiple loan accounts
- Comprehensive admin statistics

## 🌐 API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/change-password` - Password reset
- `GET /api/admin/stats` - Dashboard statistics

### Customer Endpoints
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/search?query=` - Search customers

### Payment Endpoints
- `GET /api/payments/customer/{customerId}` - Customer payments
- `PUT /api/payments/{paymentId}/status` - Update payment status
- `DELETE /api/payments/{paymentId}` - Delete payment
- `GET /api/payments/reports` - Generate payment reports

## 📈 Reports & Analytics

### Export Options
- **Daily Reports**: Individual payment transactions
- **Weekly Reports**: Payment summaries by week
- **Monthly Reports**: Monthly collection summaries
- **Yearly Reports**: Annual financial overview

### Export Formats
- **Excel (.xlsx)**: Detailed spreadsheets with formatting
- **PDF**: Professional reports with tables and charts

## 🔧 Configuration

### Environment Variables
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/weekly_payment_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password

# Server
SERVER_PORT=8080

# Security
APP_JWT_SECRET=mySecretKey
APP_JWT_EXPIRATION=86400000
```

## 🚀 Deployment

### Frontend (Netlify)
The frontend is deployed and accessible at: https://verdant-lamington-7f1c25.netlify.app

### Backend Deployment Options
1. **Local Development**: `mvn spring-boot:run`
2. **Production JAR**: `mvn clean package && java -jar target/weekly-payment-backend-1.0.0.jar`
3. **Docker**: Create Dockerfile for containerized deployment
4. **Cloud Platforms**: Deploy to AWS, Azure, or Google Cloud

### Database Deployment
For shared data access across devices, consider:
1. **Cloud MySQL**: AWS RDS, Google Cloud SQL, or Azure Database
2. **Managed Services**: PlanetScale, Aiven, or DigitalOcean Managed Databases
3. **Self-hosted**: VPS with MySQL installation

## 🔄 Data Synchronization

To ensure data consistency across all devices:
1. Deploy backend to cloud platform (Heroku, Railway, etc.)
2. Use cloud database service
3. Update frontend API endpoints to point to deployed backend
4. All devices will access the same centralized data

## 🐛 Troubleshooting

### Common Issues
1. **Export not working**: Ensure date range is valid and contains data
2. **Database connection**: Verify MySQL is running and credentials are correct
3. **CORS errors**: Check backend CORS configuration
4. **Payment dates**: Paid date is automatically set when status changes to 'paid'

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions