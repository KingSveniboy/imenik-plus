document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/users").then((req) => req.json())
        .then((users) => {
            // console.log(users);
            // console.log("Ovi podaci su dohvaćeni sa /users rute");
            users.data = users.data.sort((a, b) => a.id - b.id);

            const tableBody = document.querySelector("table.table>tbody")

            for (var i = 0; i < users.data.length; i++) {
                // console.log(i);
                // console.log(users.data[i]);
                // console.log(users.data[i].prezime);
                const tableRow = document.createElement("tr");
                const tableRednibroj = document.createElement("td");
                tableRednibroj.innerHTML = users.data[i].id;
                tableRow.appendChild(tableRednibroj);

                const tableIme = document.createElement("td");
                tableIme.innerHTML = users.data[i].ime;
                tableRow.appendChild(tableIme);

                const tablePrezime = document.createElement("td");
                tablePrezime.innerHTML = users.data[i].prezime;
                tableRow.appendChild(tablePrezime);

                const tableAkcije = renderActions(users.data[i].id);
                tableRow.appendChild(tableAkcije);
                tableBody.appendChild(tableRow);
            }
        })

});

const deleteAction = (id) => {
    fetch(`http://localhost:3000/user/${id}`, {
        method: 'DELETE'
    }).then((req) => req.json())
        .then((res) => {
            console.log(res);
            if (res.korisnik.length > 0) {
                window.location.reload();
            } else {
                alert("Greška pri brisanju korisnika");
            }
        });
}

function renderActions(id) {
    const tableActions = document.createElement("td");
    const tableActionsWrapper = document.createElement("div");
    tableActionsWrapper.className = "btn-group";
    tableActionsWrapper.role = "group";
    tableActionsWrapper.ariaLabel = "Akcije za ovog korisnika";

    // stvaranje edit buttona
    const tableActionEdit = document.createElement("button");
    tableActionEdit.type = "button";
    tableActionEdit.className = "btn btn-primary";

    const tableActionEditIcon = document.createElement("i");
    tableActionEditIcon.className = "bi bi-pencil-square icon-lg";

    tableActionEdit.appendChild(tableActionEditIcon);
    tableActionEdit.addEventListener("click", () => {
        window.location.href = `http://localhost:5500/manageUser.html?id=${id}`
    })

    // stvaranje delete buttona
    const tableActionDelete = document.createElement("button");
    tableActionDelete.type = "button";
    tableActionDelete.className = "btn btn-danger";

    const tableActionDeleteIcon = document.createElement("i");
    tableActionDeleteIcon.className = "bi bi-trash icon-lg";
    tableActionDelete.appendChild(tableActionDeleteIcon);
    tableActionDelete.addEventListener("click", () => deleteAction(id));

    // appendanje buttona na div
    tableActionsWrapper.appendChild(tableActionEdit);
    tableActionsWrapper.appendChild(tableActionDelete);

    // appendanje diva na td element
    tableActions.appendChild(tableActionsWrapper);

    return tableActions;
}

