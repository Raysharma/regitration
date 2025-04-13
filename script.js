// Initialize Supabase connection
const supabaseUrl = '[your-supabase-url]';
const supabaseAnonKey = '[your-anon-key]';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Select form and message display element
const registrationForm = document.getElementById('registrationForm');
const messageElement = document.getElementById('message');

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Collect form values
    const firstName = registrationForm.firstName.value;
    const lastName = registrationForm.lastName.value;
    const email = registrationForm.email.value;
    const password = registrationForm.password.value;

    // Basic validation
    if (!email.includes('@')) {
        displayMessage('Please enter a valid email address.', 'error');
        return;
    }

    if (password.length < 6) {
        displayMessage('Password must be at least 6 characters long.', 'error');
        return;
    }

    try {
        // Register user using Supabase Authentication
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (signUpError) {
            displayMessage(`Registration failed: ${signUpError.message}`, 'error');
            return;
        }

        // Insert user details into your 'Register' table (without password!)
        const { error: insertError } = await supabase
            .from('Register')
            .insert([
                {
                    Email: email,
                    'First Name': firstName,
                    'Last Name': lastName
                }
            ]);

        if (insertError) {
            displayMessage(`Failed to save details: ${insertError.message}`, 'error');
            return;
        }

        displayMessage('Registration successful! Please check your email to verify your account.', 'success');
        registrationForm.reset(); // Clear the form

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        displayMessage('An unexpected error occurred during registration.', 'error');
    }
});

// Helper to show messages
function displayMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
}
