# Inventory Management System API

A robust RESTful API for managing inventory products with authentication, pagination, search, and filtering capabilities.

## ✨ Features

- **Authentication**: Secure JWT-based authentication system
- **Product Management**: Complete CRUD operations for inventory products
- **Pagination**: Advanced pagination support for product listings
- **Search & Filtering**: Powerful search and filtering capabilities
- **Sorting**: Flexible sorting options for product listings
- **Swagger Documentation**: Comprehensive API documentation
- **Error Handling**: Robust error handling with detailed error messages
- **Logging**: Detailed logging for debugging and monitoring
- **Firestore Integration**: Cloud-based database for scalability

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) - NoSQL cloud database
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator & Class-transformer
- **Logging**: Custom logging service
- **Testing**: Jest & Supertest
- **Code Style**: ESLint & Prettier

## 📁 Project Structure

```
inventory-system/
├── config/                 # Configuration files
│   └── serviceAccountKey.json  # Firebase service account key
├── src/
│   ├── auth/               # Authentication module
│   │   ├── decorators/     # Custom decorators
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── guards/         # Authentication guards
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── config/             # Configuration module
│   ├── firestore/          # Firestore database module
│   ├── http-filter/        # Global HTTP exception filter
│   ├── logging/            # Logging module
│   ├── product/            # Product module
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── product.controller.ts
│   │   ├── product.module.ts
│   │   └── product.service.ts
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or pnpm
- Firebase account with Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmed-Sehili/Inventory-System.git
   cd Inventory-System
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

### Configuration

1. Create a Firebase project and enable Firestore
2. Generate a service account key from Firebase console
3. Save the service account key to `config/serviceAccountKey.json`
4. Update the `.env` file with your configuration:

```
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1h
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
ADMIN1_USERNAME=admin1
ADMIN1_PASSWORD=your_secure_password_1
ADMIN2_USERNAME=admin2
ADMIN2_PASSWORD=your_secure_password_2
```

## 📚 API Documentation

The API documentation is available at `/docs` when the server is running. It provides detailed information about all endpoints, request parameters, and response formats.

## 💻 Development

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🌐 Deployment

### Building for Production

```bash
npm run build
```

### Environment Variables

Make sure to set the following environment variables in your production environment:

- `PORT`: The port the server will run on
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: JWT token expiration time
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account key
- `ADMIN1_USERNAME`: Admin username
- `ADMIN1_PASSWORD`: Admin password
- `ADMIN2_USERNAME`: Second admin username
- `ADMIN2_PASSWORD`: Second admin password

## 🔒 Security Considerations

- JWT tokens are used for authentication
- Passwords should be strong and kept secure
- Firebase service account key should be kept confidential
- Environment variables should be properly secured
- Input validation is implemented for all endpoints
- CORS is enabled for secure cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
