const API_URL = 'http://localhost:5000/expenses';

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const weeklyTotal = document.getElementById("weekly-total");
const monthlyTotal = document.getElementById("monthly-total");

let expenses = [];

const fetchExpenses = async () => {
  const res = await fetch(API_URL);
  expenses = await res.json();
  renderExpenses();
};

const renderExpenses = () => {
  expenseList.innerHTML = "";
  let total = 0, weekly = 0, monthly = 0;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${expense.title} - ₹${expense.amount} (${expense.date})
      <button class="delete-btn" onclick="deleteExpense('${expense._id}')">Delete</button>
    `;
    expenseList.appendChild(li);

    const expenseDate = new Date(expense.date);
    const amount = parseFloat(expense.amount);
    total += amount;
    if (expenseDate >= startOfWeek) weekly += amount;
    if (expenseDate >= startOfMonth) monthly += amount;
  });

  totalAmount.textContent = total;
  weeklyTotal.textContent = weekly;
  monthlyTotal.textContent = monthly;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, amount, date })
  });

  const newExpense = await res.json();
  expenses.push(newExpense);
  form.reset();
  renderExpenses();
});

const deleteExpense = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  expenses = expenses.filter(e => e._id !== id);
  renderExpenses();
};

fetchExpenses();
