'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// property on now called field
// const/let/this not exist here

class Account {
  // declaration of public fields
  owner;
  currency;
  local;
  // deceleration of privet fields
  // real private
  // ! ! right now it NOT on js standard !!
  // !! chrome supporting it but not every browser
  #pin;

  // there is a 4 static fields:
  //    public static field
  //    privet static field
  //    public static method
  //    privet static method
  // declaring in the same wat
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.local = navigator.local;
    // protected properties
    this._movements = [];
    // real private property
    this.#pin = pin;
  }

  // public interface
  // this is real public methods
  getMovements() {
    return this._movements;
  }
  deposit(val) {
    this._movements.push(val);
    return this; // for chaining methods
  }
  withdraw(val) {
    this._movements.push(-val);
    return this; // for chaining methods
  }
  getAllDeposits() {
    return this._movements.filter(mov => mov > 0);
  }
  getAllWithdraw() {
    return this._movements.filter(mov => mov < 0);
  }
  // protected method convention
  // js for this moment not support real privacy
  _approvalLoan(val) {
    return this._movements.some(mov => mov > val * 0.1);
  }
  requestLoan(val) {
    if (this._approvalLoan(val)) {
      this.deposit(val);
    }
  }
  getPin() {
    return this.#pin;
  }
  // private method
  // ! ! right now, no browser support it!!
  // it is work BUT:
  //    the browser see it as a field
  //    so its exist on the instance and not on the prototype
  //    and this is wrong OOP implementation
  // but we can use it on a small apps or
  // on call with a few instances
  #privateMethod() {
    console.log('i am private method 😎');
  }
  runPrivateMethod() {
    this.#privateMethod();
  }
}

const igal = new Account('Igal Nikolaev', 'ILS', 1234);
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type.toUpperCase()}
        </div>
        <div class="movements__value">
          ${Math.abs(mov)}€
        </div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((accum, curr) => accum + curr);
  labelBalance.textContent = account.balance + '€';
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, cur) => accum + cur, 0);
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((accum, cur) => accum + cur, 0);
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((accum, cur) => accum + cur, 0);

  labelSumIn.textContent = incomes + '€';
  labelSumOut.textContent = Math.abs(outcomes) + '€';
  labelSumInterest.textContent = interest + '€';
};

const updateUI = function (currentAccount) {
  if (currentAccount) {
    //Display updated movements
    displayMovements(currentAccount);

    // Display updated balance
    calcDisplayBalance(currentAccount);

    // Display updated summery
    calcDisplaySummary(currentAccount);
  } else {
    containerMovements.innerHTML = '';
    labelWelcome.textContent = '';
    labelSumIn.textContent = '0';
    labelSumOut.textContent = '0';
    labelSumInterest.textContent = '0';
    labelBalance.textContent = '0';
  }
};

let currentAccount;

// TITLE Login function

const login = function (userName, pin) {
  currentAccount = accounts.find(
    account => account.userName === userName && account.pin === pin
  );

  if (currentAccount) {
    containerApp.style.opacity = 1;

    // Display UI massege
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
};

// TITLE Login Hendler
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  const userName = inputLoginUsername.value.toLowerCase();
  const pin = Number(inputLoginPin.value);

  login(userName, pin);
});

const transfer = function (receiverUserName, currentAccount, amount) {
  const receiverAccount = accounts.find(
    account => account.userName === receiverUserName
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount !== currentAccount
  ) {
    currentAccount.balance -= amount;
    receiverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
  }
};

// TITLE Transfer Hendler
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  // receive user input
  const userName = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  // Make transfer
  transfer(userName, currentAccount, amount);
  // Clear transferTo & amount inputs
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  // Update UI
  updateUI(currentAccount);
});

const closeAccount = function (confirmUser, confirmPin) {
  if (
    currentAccount?.userName === confirmUser &&
    currentAccount.pin === confirmPin
  ) {
    const index = accounts.findIndex(
      account => account.userName === currentAccount.userName
    );
    console.log(currentAccount);
    currentAccount = null;
    accounts.splice(index, 1);
  }
};

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);

  // Delete account
  closeAccount(confirmUser, confirmPin);
  if (!currentAccount) {
    updateUI(currentAccount);
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    // hide UI
    containerApp.style.opacity = 0;
  }
});

const requestLoan = function (currentAccount, amount) {
  return (
    amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)
  );
};
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (requestLoan(currentAccount, amount)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

let isSorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  isSorted = !isSorted;
  displayMovements(currentAccount, isSorted);
});
