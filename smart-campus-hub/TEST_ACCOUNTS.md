# Test Accounts for Incident Tickets Module

## Test Account Credentials

### Technician Account
- Email: technician@test.com
- Password: Tech123456
- Role: TECHNICIAN
- Purpose: Test technician-specific features (view assigned tickets, update status)

### Admin Account
- Email: admin@test.com
- Password: Admin123456
- Role: ADMIN
- Purpose: Test admin features (view all tickets, assign technicians, reject tickets)

### Regular User Account
- Email: user@test.com
- Password: User123456
- Role: USER
- Purpose: Test regular user features (create tickets, view own tickets)

## How to Create Test Accounts

### Method 1: Using Registration Endpoint
1. Register via the frontend at `/register` or use the API endpoint:
   ```bash
   POST http://localhost:8090/api/auth/register
   Content-Type: application/json

   {
     "email": "technician@test.com",
     "password": "Tech123456",
     "name": "Test Technician",
     "role": "TECHNICIAN"
   }
   ```

2. Verify the email with the OTP sent (check console logs for OTP in development)

3. Login with the credentials

### Method 2: Using MongoDB Directly
If you have direct access to MongoDB, you can insert users directly:
```javascript
db.users.insertOne({
  email: "technician@test.com",
  password: "$2a$10$encrypted_password_hash",
  name: "Test Technician",
  role: "TECHNICIAN",
  emailVerified: true,
  provider: "LOCAL",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Testing Checklist

### Technician Role Testing
- [ ] Login as technician
- [ ] View assigned tickets
- [ ] Update ticket status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- [ ] Cannot view all tickets (only assigned)
- [ ] Cannot assign technicians
- [ ] Cannot reject tickets

### Admin Role Testing
- [ ] Login as admin
- [ ] View all tickets
- [ ] Assign technicians to tickets
- [ ] Update any ticket status
- [ ] Reject tickets with reason
- [ ] Delete any ticket

### User Role Testing
- [ ] Login as regular user
- [ ] Create new ticket
- [ ] View own tickets
- [ ] Update own ticket
- [ ] Delete own ticket
- [ ] Cannot view other users' tickets
- [ ] Cannot assign technicians
