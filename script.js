const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date = document.getElementById('date');

const balance2 = document.getElementById('balance2');
const money_plus2 = document.getElementById('money-plus2');
const money_minus2 = document.getElementById('money-minus2');
const list2 = document.getElementById('list2');
const form2 = document.getElementById('form2');
const text2 = document.getElementById('text2');
const amount2 = document.getElementById('amount2');
const date2 = document.getElementById('date2');
//total amount
const total_amount = document.getElementById('total_amount');


function calculateTotal(){
  let total_1 = parseFloat(balance.innerText.substr(1));
  let total_2 = parseFloat(balance2.innerText.substr(1));

  total_amount.innerText = `£${((total_1-total_2)/2.0).toFixed(2)}`;
}

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

const localStorageTransactions_other_person = JSON.parse(
  localStorage.getItem('transactions_other_person')
  );

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

let transactions_other_person = 
localStorage.getItem('transactions_other_person') !== null ? localStorageTransactions_other_person : [];


// Add transaction
function addTransaction2(e) {
  e.preventDefault();

  if (text2.value.trim() === '' || amount2.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      user: 'user2',
      id: generateID(),
      text: text2.value,
      amount: +amount2.value,
      date: date2.value
    };

    transactions_other_person.push(transaction);

    addTransactionDOM2(transaction);
    updateValues2();

    updateLocalStorage2();

    text2.value = '';
    amount2.value = '';
    date2.value = '';
    calculateTotal();
  }
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      user:'user1',
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
    date.value = '';
    calculateTotal();
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign ${sign}
  //const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <div class="date">${transaction.date}</div> <span>£${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}
function addTransactionDOM2(transaction) {
  // Get sign ${sign}
  //const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <div class="date">${transaction.date}</div> <span>£${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction2(${
    transaction.id
  })">x</button>
  `;

  list2.appendChild(item);
}


// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `£${total}`;
  money_plus.innerText = `£${income}`;
  money_minus.innerText = `£${expense}`;
}


function updateValues2() {
  const amounts = transactions_other_person.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance2.innerText = `£${total}`;
  money_plus2.innerText = `£${income}`;
  money_minus2.innerText = `£${expense}`;
}


// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
  calculateTotal();
}

function removeTransaction2(id) {
  transactions_other_person = transactions_other_person.filter(transaction => transaction.id !== id);

  updateLocalStorage2();

  init2();
  calculateTotal();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateLocalStorage2() {
  localStorage.setItem('transactions_other_person', JSON.stringify(transactions_other_person));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();


function init2() {
  list2.innerHTML = '';

  transactions_other_person.forEach(addTransactionDOM2);
  updateValues2();
}

init2();
calculateTotal();

form.addEventListener('submit', addTransaction);
form2.addEventListener('submit', addTransaction2);


function prepareDownload(){
var json = transactions.concat(transactions_other_person);
var fields = Object.keys(json[0])
var replacer = function(key, value) { return value === null ? '' : value } 
var csv = json.map(function(row){
  return fields.map(function(fieldName){
    return JSON.stringify(row[fieldName], replacer)
  }).join(',')
})
csv.unshift(fields.join(',')) // add header column
 csv = csv.join('\r\n');
 //console.log(csv);
  return csv;
}


function exportData() {
  calculateTotal();
  let csv = prepareDownload();
  var item = localStorage.csv= csv;

  var ary = localStorage.getItem( "csv" ); //csv as a string
  var blob = new Blob([ary], {type: "text/csv"});
  var url = URL.createObjectURL(blob);
  var a = document.querySelector("#results"); // id of the <a> element to render the download link
  a.href = url;
  a.download = "file.csv";

}
