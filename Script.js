const form = document.querySelector(".add");
const incomelist = document.querySelector("ul.income-list");
const expenselist = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
	localStorage.getItem("transactions") !== null
		? JSON.parse(localStorage.getItem("transactions"))
		: [];

function updateStatistics() {
	const updateIncome = transactions
		.filter((transaction) => {
			return transaction.amount > 0;
		})
		.reduce((total, transaction) => (total += transaction.amount), 0);

	const updateExpense = transactions
		.filter((transaction) => {
			return transaction.amount < 0;
		})
		.reduce(
			(total, transaction) => (total += Math.abs(transaction.amount)),
			0
		);

	updateBalance = updateIncome - updateExpense;

	balance.textContent = updateBalance;
	income.textContent = updateIncome;
	expense.textContent = updateExpense;
}

updateStatistics();

function generateTemplate(id, source, amount, time) {
	return `<li data-id= "${id}">
				<p>
					<span>${source}</span>
					<span id="time">${time}</span>
				</p>
					<span>$ ${Math.abs(amount)}</span>
					<i class="fa-solid fa-trash-can delete"></i>
			</li>`;
}

function addTransactionDom(id, source, amount, time) {
	if (amount > 0) {
		incomelist.innerHTML += generateTemplate(id, source, amount, time);
	} else {
		expenselist.innerHTML += generateTemplate(id, source, amount, time);
	}
}

function addTransaction(source, amount) {
	const time = new Date();
	const transaction = {
		id: Math.floor(Math.random() * 100000),
		source: source,
		amount: amount,
		time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
	};

	transactions.push(transaction);
	localStorage.setItem("transactions", JSON.stringify(transactions));
	addTransactionDom(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	if (form.source.value.trim() === "" || form.amount.value === "") {
		return alert("please add Proper Data!");
	}

	addTransaction(form.source.value.trim(), Number(form.amount.value));
	updateStatistics();
	form.reset();
});

function getTransaction() {
	transactions.forEach((element) => {
		if (element.amount > 0) {
			incomelist.innerHTML += generateTemplate(
				element.id,
				element.source,
				element.amount,
				element.time
			);
		} else {
			expenselist.innerHTML += generateTemplate(
				element.id,
				element.source,
				element.amount,
				element.time
			);
		}
	});
}

getTransaction();

function deleteTransaction(id) {
	transactions = transactions.filter((transaction) => {
		return transaction.id !== id;
	});
	localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomelist.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete")) {
		event.target.parentElement.remove();
		deleteTransaction(Number(event.target.parentElement.dataset.id));
		updateStatistics();
	}
});

expenselist.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete")) {
		event.target.parentElement.remove();
		deleteTransaction(Number(event.target.parentElement.dataset.id));
		updateStatistics();
	}
});
