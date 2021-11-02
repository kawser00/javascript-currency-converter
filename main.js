// https://app.exchangerate-api.com/

//User Interface/DOM related properties and methods
const UI = {
  loadSelector() {
    const formElm = document.querySelector("form");
    const InputElm = document.querySelector("#currencyInput");
    const convertFromElm = document.querySelector("#selectCurrencyFrom");
    const convertToElm = document.querySelector("#selectCurrencyTo");
    const outputElm = document.querySelector("#convert_output");
    const messageElm = document.querySelector("#messageWrapper");

    return {
      formElm,
      InputElm,
      convertFromElm,
      convertToElm,
      outputElm,
      messageElm,
    };
  },
  hideMessage() {
    const { messageElm } = this.loadSelector();
    setTimeout(() => {
      messageElm.innerHTML = "";
    }, 2000);
  },
  showMessage(msg) {
    const { messageElm } = this.loadSelector();
    const elm = `<div class='alert alert-danger'>${msg}</div>`;
    messageElm.innerHTML = elm;
    //hiding message
    this.hideMessage();
  },
  validateInput(amount) {
    if (amount <= 0 || isNaN(amount)) {
      this.showMessage("Please enter a valid amount");
      return false;
    }
    return true;
  },
  getInput() {
    const { InputElm, convertFromElm, convertToElm } = this.loadSelector();
    const inputVal = +InputElm.value;
    const currencyOne = convertFromElm.value;
    const currencyTwo = convertToElm.value;

    //checking validation
    const isValidated = this.validateInput(inputVal);

    return { inputVal, currencyOne, currencyTwo, isValidated };
  },
  displayOutput(InputAmount, totalAmount, currencyOne, currencyTwo) {
    const { outputElm } = this.loadSelector();
    outputElm.innerText = `${InputAmount} ${currencyOne} = ${totalAmount} ${currencyTwo}`;
  },
  initialize() {
    const { formElm, InputElm } = this.loadSelector();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { inputVal, currencyOne, currencyTwo, isValidated } =
        this.getInput();

      if (isValidated) {
        currencyData.targetCurrency = currencyOne;
        //getting data from api
        const data = await currencyData.getCurrency();
        //calculating total amount of converted currency
        const totalConvertedAmount = (inputVal * data[currencyTwo]).toFixed(2);
        this.displayOutput(
          inputVal,
          totalConvertedAmount,
          currencyOne,
          currencyTwo
        );
      }
      InputElm.value = 0;
    });
  },
};
UI.initialize();

//temp data store and dealing
const currencyData = {
  targetCurrency: "",
  API_URL: "https://v6.exchangerate-api.com",
  API_KEY: "fb02e38abb1def3e53c877bb",

  async getCurrency() {
    try {
      const res = await fetch(
        `${this.API_URL}/v6/${this.API_KEY}/latest/${this.targetCurrency}`
      );
      const data = await res.json();
      return data.conversion_rates;
    } catch (err) {
      UI.showMessage("Problem found in converting currency");
    }
  },
};
