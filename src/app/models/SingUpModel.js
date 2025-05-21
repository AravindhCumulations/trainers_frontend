// lib/signupModel.js

const users = []; // Simulated in-memory user store

export const SignupModel = {
  createUser({ role, companyName, email, password }) {
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      role,
      companyName,
      email,
      password,
      isFirstLogin: true // Added this flag
    };

    users.push(newUser);
    return newUser;
  },

  getAllUsers() {
    return users;
  },

  // Optional: simulate first login update
  markFirstLoginComplete(email) {
    const user = users.find(user => user.email === email);
    if (user) {
      user.isFirstLogin = false;
    }
  }
};
