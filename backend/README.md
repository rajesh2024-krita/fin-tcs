
# Member Management API - Backend

This is the ASP.NET Core Web API backend for the Member Management System.

## Structure
- **Controllers/**: API controllers
- **Data/**: DbContext and database configuration  
- **Models/**: Entity models
- **Repositories/**: Data access layer
- **Services/**: Business logic layer

## Running the API

From the backend folder:
```bash
dotnet restore
dotnet run
```

The API will be available at `http://0.0.0.0:5000`

## API Endpoints
- GET `/api/members` - Get all members
- GET `/api/members/{id}` - Get member by ID
- POST `/api/members` - Create new member
- PUT `/api/members/{id}` - Update member
- DELETE `/api/members/{id}` - Delete member

## Swagger Documentation
Available at `http://0.0.0.0:5000/swagger` when running in development mode.
