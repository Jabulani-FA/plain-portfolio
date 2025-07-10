document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await res.text();

    if (res.ok) {
      alert("Message sent successfully!");
      form.reset(); // ✅ Clear form
    } else {
      alert("Something went wrong: " + result);
    }
  } catch (err) {
    alert("Network error. Please try again.");
    console.error(err);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit"; // ✅ Reset button
});


// const form = document.getElementById('contact-form');
// form.addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const formData = {
//         name: document.getElementById('name').value,
//         email: document.getElementById('email').value,
//         message: document.getElementById('message').value,
//     };

//     try {
//         const res = await fetch('/api/contact', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         const data = await res.json();
//         console.log(data)

//         if (res.ok) {
//             alert('Message sent successfully!');
//             form.reset();
//         } else {
//             alert('Error: ' + (data.message || 'Something went wrong'));
//         }
//     } catch (error) {
//         alert('Network Error: ' + error.message);
//     }
// });