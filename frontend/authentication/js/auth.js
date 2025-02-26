if(form.classList.contains("register")){
    form.addEventListener("submit", registerUser)
}else{
    form.addEventListener("submit", loginUser);
}
//handle forgot password too here


async function loginUser(event) {
    event.preventDefault(); // Prevent form from reloading the page
  
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
  
    const errors = getLoginFormErrors(email, password);
  
    if (errors.length > 0) {
        console.log("Validation Errors:", errors);
        error_message.innerText  = errors.join(". ")
        return; // Stop the function if validation fails
    }
  
    // Prepare data for sending
    const loginData = { email, password };
    console.log(loginData)
  
    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
  
        const data = await response.json(); // Convert response to JSON
  
        if (response.ok) {
            console.log("Login successful:", data);
            // Redirect user or show success message
        } else {
            console.log("Login failed:", data.message);
            // Handle login failure (show error message, etc.)
        }
    } catch (error) {
        console.error("Error sending request:", error);
    }
  }

  async function registerUser(event) {
    event.preventDefault(); // Prevent form from reloading the page
    const firstname = document.getElementById("firstname-input").value;
    const lastname = document.getElementById("lastname-input").value;
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const repeat_password = document.getElementById("repeat-password-input").value;
  
    const errors = getSignupFormErrors(firstname, lastname, email, password, repeat_password);
  
    if (errors.length > 0) {
        console.log("Validation Errors:", errors);
        error_message.innerText  = errors.join(". ")
        return; // Stop the function if validation fails
    }
  
    // Prepare data for sending
    const registerData = { firstname, lastname, email, password, repeat_password };
    console.log(registerData)
  
    try {
        const response = await fetch(`${CONFIG.API_URL}auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });
  
        const data = await response.json(); // Convert response to JSON
  
        if (response.ok) {
            console.log("Registration successful:", data);
            // Redirect user or show success message
        } else {
            console.log("Registration failed:", data.message);
            // Handle registration failure (show error message, etc.)
        }
    } catch (error) {
        console.error("Error sending request:", error);
    }
  }