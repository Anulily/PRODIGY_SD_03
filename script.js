document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const contactList = document.getElementById("contactList");

    async function fetchContacts() {
        const res = await fetch("/get_contacts");
        const contacts = await res.json();
        renderContacts(contacts);
    }

    function renderContacts(contacts) {
        contactList.innerHTML = "";
        contacts.forEach((c, index) => {
            const div = document.createElement("div");
            div.classList.add("contact-card");
            div.innerHTML = `
                <div>
                    <strong>${c.name}</strong><br>
                    ${c.phone} | ${c.email}
                </div>
                <div class="actions">
                    <button class="edit" onclick="editContact(${index})">Edit</button>
                    <button onclick="deleteContact(${index})">Delete</button>
                </div>
            `;
            contactList.appendChild(div);
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const contact = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value
        };

        await fetch("/add_contact", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(contact)
        });

        form.reset();
        fetchContacts();
    });

    window.deleteContact = async (index) => {
        await fetch(`/delete_contact/${index}`, { method: "DELETE" });
        fetchContacts();
    };

    window.editContact = async (index) => {
        const newName = prompt("Enter new name:");
        const newPhone = prompt("Enter new phone:");
        const newEmail = prompt("Enter new email:");

        await fetch(`/edit_contact/${index}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: newName, phone: newPhone, email: newEmail })
        });

        fetchContacts();
    };

    fetchContacts();
});
