// For Gender
document.getElementById('gender').addEventListener('change', function() {
    var otherOption = document.getElementById('gender').value === 'other';
    document.getElementById('gender_specify_label').style.display = otherOption ? 'block' : 'none';
    document.getElementById('gender_specify').style.display = otherOption ? 'block' : 'none';
});

// For Language
document.getElementById('language').addEventListener('change', function() {
    var otherOption = document.getElementById('language').value === 'other';
    document.getElementById('language_specify_label').style.display = otherOption ? 'block' : 'none';
    document.getElementById('language_specify').style.display = otherOption ? 'block' : 'none';
});

// For Username
document.getElementById('username').addEventListener('input', function() {
    const username = this.value;
    const feedback = document.getElementById('usernameFeedback');
    const usernameRegex = /^[a-zA-Z0-9_]{5,15}$/;

    if (!usernameRegex.test(username)) {
        feedback.textContent = 'Username must be 5-15 characters long, and can contain letters, numbers, and underscores.';
    } else {
        feedback.textContent = '';
    }
});

document.getElementById('AdditionallInfoForm').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value;
    const usernameRegex = /^[a-zA-Z0-9_]{5,15}$/;

    if (!usernameRegex.test(username)) {
        event.preventDefault();
        document.getElementById('usernameFeedback').textContent = 'Please choose a valid username.';
    }
});

// For Profile Picture Upload


document.getElementById('editPicBtn').addEventListener('click', function() {
    document.getElementById('uploadPic').click();
  });
  
  document.getElementById('uploadPic').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
      document.getElementById('profilePic').src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
  

  // Selecting the form and save button elements
const personalInfoForm = document.getElementById('personalInfoForm');
const saveButton = document.querySelector('.personal-info button');

// Function to save form data to localStorage
function saveFormData() {
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        dob: document.getElementById('Dob').value,
        emailAddress: document.getElementById('email-address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        // Add more fields as needed
    };

    // Save form data to localStorage
    localStorage.setItem('formData', JSON.stringify(formData));
    ;
}

// Event listener for the "Save" button
saveButton.addEventListener('click', function() {
    saveFormData();
    alert('Your information has been saved!');
});

// Function to load saved form data from localStorage
function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
        document.getElementById('first-name').value = savedData.firstName;
        document.getElementById('last-name').value = savedData.lastName;
        document.getElementById('Dob').value = savedData.dob;
        document.getElementById('email-address').value = savedData.emailAddress;
        document.getElementById('phoneNumber').value = savedData.phoneNumber;
        // Load more fields as needed
    }
}

// Load saved form data when the page loads
window.addEventListener('load', function() {
    loadFormData();
});
