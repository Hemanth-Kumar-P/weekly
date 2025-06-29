# Weekly Payment Management Backend

This is the backend application for the Weekly Payment Management System built with Spring Boot and MySQL.

## Features

- RESTful API for customer and payment management
- Admin authentication and authorization
- Automatic weekly payment schedule generation
- Payment status tracking (PAID, DUE, MISSED)
- Admin dashboard statistics
- MySQL database integration
- CORS enabled for frontend integration

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE weekly_payment_db;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Build and Run

1. Clone the repository and navigate to the backend directory
2. Build the application:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 3. Default Admin Credentials

- Phone: 7815981315
- Password: Phk@1234

## API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/change-password` - Change admin password
- `GET /api/admin/stats` - Get admin dashboard statistics

### Customer Endpoints
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/phone/{phone}` - Get customers by phone number
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Payment Endpoints
- `GET /api/payments/customer/{customerId}` - Get payments for a customer
- `PUT /api/payments/{paymentId}/status` - Update payment status

## Database Schema

### Tables
1. **admins** - Admin user credentials
2. **customers** - Customer information and loan details
3. **payments** - Weekly payment records

### Key Features
- Automatic weekly payment generation (10 weeks)
- Payment status tracking
- Customer can have multiple loan accounts
- Admin statistics calculation

## Configuration

The application uses the following key configurations:

- **Database**: MySQL with JPA/Hibernate
- **Security**: BCrypt password encoding
- **CORS**: Enabled for all origins
- **Logging**: Debug level for application packages

## Development

To modify the application:

1. Update entity models in `src/main/java/com/paymentmanagement/entity/`
2. Add new repositories in `src/main/java/com/paymentmanagement/repository/`
3. Implement business logic in `src/main/java/com/paymentmanagement/service/`
4. Create REST endpoints in `src/main/java/com/paymentmanagement/controller/`

## Testing

Run tests with:
```bash
mvn test
```

## Production Deployment

1. Update `application.properties` for production database
2. Build the JAR file: `mvn clean package`
3. Run with: `java -jar target/weekly-payment-backend-1.0.0.jar`