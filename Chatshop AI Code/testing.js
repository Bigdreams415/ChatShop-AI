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
  