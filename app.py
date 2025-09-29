from flask import Flask, render_template, request, jsonify
import json, os

app = Flask(__name__)
CONTACTS_FILE = "contacts.json"

def load_contacts():
    if os.path.exists(CONTACTS_FILE):
        with open(CONTACTS_FILE, "r") as file:
            return json.load(file)
    return []

def save_contacts(contacts):
    with open(CONTACTS_FILE, "w") as file:
        json.dump(contacts, file, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_contacts", methods=["GET"])
def get_contacts():
    return jsonify(load_contacts())

@app.route("/add_contact", methods=["POST"])
def add_contact():
    contacts = load_contacts()
    data = request.json
    contacts.append(data)
    save_contacts(contacts)
    return jsonify({"message": "Contact added successfully!"})

@app.route("/edit_contact/<int:index>", methods=["PUT"])
def edit_contact(index):
    contacts = load_contacts()
    if 0 <= index < len(contacts):
        contacts[index] = request.json
        save_contacts(contacts)
        return jsonify({"message": "Contact updated!"})
    return jsonify({"error": "Invalid index"}), 400

@app.route("/delete_contact/<int:index>", methods=["DELETE"])
def delete_contact(index):
    contacts = load_contacts()
    if 0 <= index < len(contacts):
        removed = contacts.pop(index)
        save_contacts(contacts)
        return jsonify({"message": f"Deleted {removed['name']}"})
    return jsonify({"error": "Invalid index"}), 400

if __name__ == "__main__":
    app.run(debug=True)
