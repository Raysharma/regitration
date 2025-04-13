const supabaseUrl = 'https://vaqksnkyciswgkztafbk.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcWtzbmt5Y2lzd2drenRhZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzI2OTIsImV4cCI6MjA2MDEwODY5Mn0.mH-f-VDmo3GA2KlKNDb9L2FOIqLQZjBDYIzuCZVVsHM'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const registrationForm = document.getElementById('registrationForm');
const messageElement = document.getElementById('message');

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const firstName = registrationForm.firstName.value;
    const lastName = registrationForm.lastName.value;
    const email = registrationForm.email.value;
    const password = registrationForm.password.value;

    // Simple email validation (you might want more robust validation)
    if (!email.includes('@')) {
        displayMessage('Please enter a valid email address.', 'error');
        return;
    }

    if (password.length < 6) {
        displayMessage('Password must be at least 6 characters long.', 'error');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    // You can add more user metadata here
                }
            }
        });

        if (error) {
            displayMessage(`Registration failed: ${error.message}`, 'error');
        } else {
            console.log('Registration successful:', data);
            displayMessage('Registration successful! Please check your email to verify your account.', 'success');
            registrationForm.reset(); // Clear the form
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        displayMessage('An unexpected error occurred during registration.', 'error');
    }
});

function displayMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`; // Add class for styling
}
