import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Initialize Supabase connection
const supabaseUrl = "https://vaqksnkyciswgkztafbk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcWtzbmt5Y2lzd2drenRhZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzI2OTIsImV4cCI6MjA2MDEwODY5Mn0.mH-f-VDmo3GA2KlKNDb9L2FOIqLQZjBDYIzuCZVVsHM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase client initialized:", supabase);
// Select form and message display element
const registrationForm = document.getElementById("registrationForm")
const messageElement = document.getElementById("message")

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault() // Prevent page reload

  // Collect form values
  const firstName = registrationForm.firstname.value
  const lastName = registrationForm.lastName.value
  const email = registrationForm.email.value
  const password = registrationForm.password.value

  // Basic validation for empty fields
  if (!firstName || !lastName || !email || !password) {
    displayMessage("Please fill in all fields.", "error")
    return
  }

  // Basic validation
  if (!email.includes("@")) {
    displayMessage("Please enter a valid email address.", "error")
    return
  }

  if (password.length < 6) {
    displayMessage("Password must be at least 6 characters long.", "error")
    return
  }

  try {
    // Register user using Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (signUpError) {
      displayMessage(`Registration failed: ${signUpError.message}`, "error")
      return
    }

    // Insert user details into 'Register' table (no password!)
    const { error: insertError } = await supabase.from("Register").insert([
      {
        Email: email,
        First_Name: firstName,
        Last_Name: lastName,
        
      },
    ])

    if (insertError) {
      displayMessage(`Failed to save user details: ${insertError.message}`, "error")
      return
    }

    displayMessage("Registration successful! Please check your email to verify your account.", "success")
    registrationForm.reset() // Clear the form

  } catch (error) {
    console.error("Unexpected error:", error)
    displayMessage("An unexpected error occurred during registration.", "error")
  }
})

// Helper function to show messages on the page
function displayMessage(text, type) {
  messageElement.textContent = text
  messageElement.className = `message ${type}`
}
