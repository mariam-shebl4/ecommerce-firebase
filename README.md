# E-commerce Application  

## Objective  
Build a React TypeScript e-commerce platform that provides users with an intuitive shopping experience. The application includes essential features such as account management, product browsing, a shopping cart, and a secure checkout process.  

---

## Documentation  

### Setup Instructions  
Follow the steps below to set up and run the project locally after cloning it from GitHub:  

1. **Clone the Repository**  
   Use the following command to clone the project to your local machine:  
   ```bash  
   git clone [repository URL]  
   cd [project directory]  

2. **Install Dependencies**
Ensure you have Node.js installed, then run the following command to install all required dependencies:

```bash
npm install  
```
3. **Configure Environment Variables**
The project requires specific Firebase and Stripe keys to function.

A file named env.md is provided, which contains the required environment variables.
Create a .env file in the root directory of the project and copy the following keys into it, replacing the placeholder values with your actual Firebase and Stripe keys:
env
Copy code
VITE_API_KEY=---------------------  
VITE_AUTH_DOMAIN=--------------------------  
VITE_PROJECT_ID=--------------------------  
VITE_STORAGE_BUCKET=-------------------------  
VITE_MESSAGING_SENDER_ID=-------------------------  
VITE_APP_ID=-------------------------  
VITE_MEASUREMENT_ID=-------------------------  
VITE_STRIPE_PUBLISH_KEY=-------------------------  
Start the Development Server

4. **Run the following command to start the application:**

```bash
npm run dev  
```
The application will be accessible at http://localhost:5173 by default.