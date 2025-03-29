document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category-select");
  const amountInput = document.getElementById("amount-input");
  const dateInput = document.getElementById("date-input");
  const addButton = document.getElementById("add-btn");
  const expensesTableBody = document.getElementById("expenses-table-body");
  const totalExpenses = document.getElementById("total-expenses");

  let expenses = [];

  // Fetch expenses from server
  function fetchExpenses() {
    fetch("http://localhost:3000/expenses")
      .then((response) => response.json())
      .then((data) => {
        expenses = data;
        renderExpenses();
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  }

  // Render expenses in table
  function renderExpenses() {
    expensesTableBody.innerHTML = "";
    let total = 0;

    if (expenses.length === 0) {
      expensesTableBody.innerHTML =
        "<tr><td colspan='4' style='text-align:center;'>No expenses added yet.</td></tr>";
    }

    expenses.forEach((expense) => {
      total += parseFloat(expense.amount);
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${expense.category}</td>
                <td>$${expense.amount}</td>
                <td>${expense.date}</td>
                <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
            `;
      expensesTableBody.appendChild(row);
    });

    totalExpenses.textContent = `$${total.toFixed(2)}`;
  }

  // Add new expense
  addButton.addEventListener("click", () => {
    const category = categorySelect.value;
    const amount = amountInput.value;
    const date = dateInput.value;

    if (!category || !amount || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const newExpense = { category, amount, date };

    fetch("http://localhost:3000/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    })
      .then((response) => response.json())
      .then((expense) => {
        expenses.push(expense);
        renderExpenses();
      })
      .catch((error) => console.error("Error adding expense:", error));
  });

  // Delete expense
  expensesTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const expenseId = event.target.getAttribute("data-id");

      fetch(`http://localhost:3000/expenses/${expenseId}`, { method: "DELETE" })
        .then(() => {
          expenses = expenses.filter((exp) => exp.id !== parseInt(expenseId));
          renderExpenses();
        })
        .catch((error) => console.error("Error deleting expense:", error));
    }
  });

  fetchExpenses();
});
