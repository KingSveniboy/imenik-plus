function saveUser(userForm, id) {
    const userData = {};
    const inputs = userForm.getElementsByTagName("input");
    for (let input of inputs) {
        console.log(input.name);
        userData[input.name] = input.value;
        console.log(input.value);
    }
    console.log(userData);
    let method = "POST";
    let route = 'users/create';

    if (id) {
        method = 'PUT';
        route = `user/${id}`;
    }

    fetch(`http://localhost:3000/${route}`, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => console.log("Success:", data))
        .catch(error => console.error("Error:", error.message));
}

function getUserById(id) {
    fetch(`http://localhost:3000/user?id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            const user = data.korisnik[0];
            const form = document.getElementById("userForm");
            const inputs = form.getElementsByTagName("input");

            for (let input of inputs) {
                if (user.hasOwnProperty(input.name)) {
                    input.value = user[input.name];
                }
            }
        })
        .catch(error => console.error("Error:", error.message));
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("userForm");
    const userId = new URLSearchParams(window.location.search).get("id");

    if (userId) {
        getUserById(userId)
    }


    form.addEventListener("submit", (e) => {
        e.preventDefault();
        saveUser(form, userId);
         window.location.href = 'http://localhost:5500';
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("userForm");
//     const userId = new URLSearchParams(window.location.search).get("id");
//     const apiBaseUrl = "http://localhost:3000/users";

//     if (!userId) return;

//     fetch("http://localhost:3000/users/${userId}")
//         .then(res => res.json())
//         .then(user => {
//             for (let key in user) {
//                 if (form[key]) {
//                     form[key].value = user[key];
//                 }
//             }
//         })
//         .catch(err => console.error("Failed to load user:", err.message));

//     form.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const userData = {};
//         const inputs = form.getElementsByTagName("input");
//         for (let input of inputs) {
//             userData[input.name] = input.value;
//         }

//         fetch("http://localhost:3000/users/${userId}", {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(userData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Success:", data);
//             alert("Korisnik ažuriran!");
//             window.location.href = "index.html";
//         })
//         .catch(error => console.error("Error:", error.message));
//     }, { once: true });
// });
