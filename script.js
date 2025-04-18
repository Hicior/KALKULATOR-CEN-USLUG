// Data tables from README
const kpirPriceTable = {
  "0-10": 380.0,
  "11-30": 480.0,
  "31-50": 580.0,
  "51-70": 710.0,
  "71-90": 840.0,
  "91-110": 970.0,
  "111-130": 1100.0,
  "131-150": 1230.0,
  "151-170": 1360.0,
  "171-190": 1490.0,
  "191-210": 1620.0,
  "211-230": 1750.0,
  "231-250": 1880.0,
  "251-270": 2010.0,
  "271-290": 2140.0,
  "291-310": 2270.0,
  "311-330": 2400.0,
  "331-350": 2530.0,
  "351-370": 2660.0,
  "371-390": 2790.0,
  "391-410": 2920.0,
  "411-430": 3050.0,
  "431-450": 3180.0,
  "451-470": 3310.0,
  "471-490": 3440.0,
  "491-500": 3570.0,
};

const khPriceTable = {
  "0-20": 1380.0,
  "21-40": 1720.0,
  "41-60": 2070.0,
  "61-80": 2300.0,
  "81-100": 2530.0,
  "101-120": 2730.0,
  "121-140": 2930.0,
  "141-160": 3130.0,
  "161-180": 3330.0,
  "181-200": 3530.0,
  "201-220": 3730.0,
  "221-240": 3930.0,
  "241-260": 4130.0,
  "261-280": 4330.0,
  "281-300": 4530.0,
  "301-320": 4730.0,
  "321-340": 4930.0,
  "341-360": 5130.0,
  "361-380": 5330.0,
  "381-400": 5530.0,
  "401-420": 5730.0,
  "421-440": 5930.0,
  "441-460": 6130.0,
  "461-480": 6330.0,
  "481-500": 6530.0,
};

const internetPaymentsTable = {
  "1-5": 25.0,
  "6-10": 28.75,
  "11-15": 33.06,
  "16-20": 38.02,
  "21-25": 43.72,
  "26-30": 50.28,
  "31-35": 57.82,
  "36-40": 66.49,
  "41-45": 76.46,
  "46-50": 87.93,
  "51-55": 101.12,
  "56-60": 116.29,
  "61-65": 133.73,
  "66-70": 153.79,
  "71-75": 176.86,
  "76-80": 203.39,
  "81-85": 233.9,
  "86-90": 268.99,
  "91-95": 309.34,
  "96-100": 355.74,
};

// DOM elements
const mainPanel = document.getElementById("main-panel");
const kpirPanel = document.getElementById("kpir-panel");
const khPanel = document.getElementById("kh-panel");
const resultPanel = document.getElementById("result-panel");
const kpirButton = document.getElementById("kpir-button");
const khButton = document.getElementById("kh-button");
const backFromKpirButton = document.getElementById("back-from-kpir");
const backFromKhButton = document.getElementById("back-from-kh");
const calculateAgainButton = document.getElementById("calculate-again");

// Variables to store calculation data
let currentCalculation = {
  type: "",
  docs: "",
  basePrice: 0,
  extras: [],
  finalPrice: 0,
};

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
});

function setupEventListeners() {
  // Main panel buttons
  kpirButton.addEventListener("click", function () {
    showPanel(kpirPanel);
    currentCalculation.type = "KPiR";
  });

  khButton.addEventListener("click", function () {
    showPanel(khPanel);
    currentCalculation.type = "KH";
  });

  // Back buttons
  backFromKpirButton.addEventListener("click", function () {
    showPanel(mainPanel);
  });

  backFromKhButton.addEventListener("click", function () {
    showPanel(mainPanel);
  });

  // Calculate Again button
  calculateAgainButton.addEventListener("click", function () {
    showPanel(mainPanel);
  });

  // Add event listener to the existing calculate button in KH panel
  const khCalculateButton = khPanel.querySelector(".calculate-button");
  if (khCalculateButton) {
    khCalculateButton.addEventListener("click", calculateKh);
  }

  // Add event listener to the KPIR calculate button
  const kpirCalculateButton = document.getElementById("kpir-calculate");
  if (kpirCalculateButton) {
    kpirCalculateButton.addEventListener("click", calculateKpir);
  }

  // Internet payments visibility
  document
    .querySelectorAll('input[name="kpir-internet-payments"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const paymentsCountDiv = document.getElementById(
          "kpir-internet-payments-count"
        );
        if (this.value === "tak") {
          paymentsCountDiv.classList.remove("hidden");
        } else {
          paymentsCountDiv.classList.add("hidden");
        }
      });
    });

  // Internet payments visibility for KH
  document
    .querySelectorAll('input[name="kh-internet-payments"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const paymentsCountDiv = document.getElementById(
          "kh-internet-payments-count"
        );
        if (this.value === "tak") {
          paymentsCountDiv.classList.remove("hidden");
        } else {
          paymentsCountDiv.classList.add("hidden");
        }
      });
    });

  // Calculate buttons (added to each panel)
  addCalculateButton(kpirPanel, calculateKpir);
  addCalculateButton(khPanel, calculateKh);
}

function addCalculateButton(panel, calculateFunction) {
  // Check if button already exists
  if (panel.querySelector(".calculate-button")) {
    return;
  }

  const calculateButton = document.createElement("button");
  calculateButton.textContent = "Oblicz";
  calculateButton.classList.add("calculate-button");
  calculateButton.addEventListener("click", calculateFunction);

  // Find the button group within the panel
  const buttonGroup = panel.querySelector(".button-group");

  // Insert before the back button if button group exists, otherwise append to panel
  if (buttonGroup) {
    const backButton = buttonGroup.querySelector(".back-button");
    if (backButton) {
      buttonGroup.insertBefore(calculateButton, backButton);
    } else {
      buttonGroup.appendChild(calculateButton); // Fallback if no back button
    }
  } else {
    panel.appendChild(calculateButton); // Fallback if no button group
  }
}

function showPanel(panel) {
  // Hide all panels
  mainPanel.classList.add("hidden");
  kpirPanel.classList.add("hidden");
  khPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");

  // Show selected panel
  panel.classList.remove("hidden");
}

function calculateKpir() {
  // Reset calculation
  currentCalculation.extras = [];

  // Get values from form
  const docsRange = document.getElementById("kpir-docs").value;
  const vatMargin =
    document.querySelector('input[name="kpir-vat-margin"]:checked').value ===
    "tak";
  const vatProportion =
    document.querySelector('input[name="kpir-vat-proportion"]:checked')
      .value === "tak";
  const internetPayments =
    document.querySelector('input[name="kpir-internet-payments"]:checked')
      .value === "tak";

  // Get base price
  let basePrice = kpirPriceTable[docsRange];
  let finalPrice = basePrice;

  // Apply additional costs
  if (vatMargin) {
    const additionalCost = basePrice * 0.26;
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "VAT Marża (+26%)",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  if (vatProportion) {
    const additionalCost = basePrice * 0.45;
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "Proporcja VAT (+45%)",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  if (internetPayments) {
    const paymentsRange = document.getElementById("kpir-payments-count").value;
    const additionalCost = internetPaymentsTable[paymentsRange];
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "Płatności Internetowe (" + paymentsRange + ")",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  // Update calculation object
  currentCalculation.docs = docsRange;
  currentCalculation.basePrice = basePrice;
  currentCalculation.finalPrice = finalPrice;

  // Show results
  showResults();
}

function calculateKh() {
  // Reset calculation
  currentCalculation.extras = [];

  // Get values from form
  const docsRange = document.getElementById("kh-docs").value;
  const production =
    document.querySelector('input[name="kh-production"]:checked').value ===
    "tak";
  const citEstonian =
    document.querySelector('input[name="kh-cit"]:checked').value === "tak";
  const vatMargin =
    document.querySelector('input[name="kh-vat-margin"]:checked').value ===
    "tak";
  const vatProportion =
    document.querySelector('input[name="kh-vat-proportion"]:checked').value ===
    "tak";
  const internetPayments =
    document.querySelector('input[name="kh-internet-payments"]:checked')
      .value === "tak";

  // Get base price
  let basePrice = khPriceTable[docsRange];
  let finalPrice = basePrice;

  // Apply additional costs
  if (production) {
    const additionalCost = 400;
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "Produkcja/Budowlanka",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  if (citEstonian) {
    const additionalCost = basePrice * 0.25;
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "CIT Estoński (+25%)",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  if (vatMargin) {
    const additionalCost = basePrice * 0.26;
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "VAT Marża (+26%)",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  if (vatProportion) {
    const additionalCost = basePrice * 0.45;
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "Proporcja VAT (+45%)",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  if (internetPayments) {
    const paymentsRange = document.getElementById("kh-payments-count").value;
    const additionalCost = internetPaymentsTable[paymentsRange];
    finalPrice += additionalCost;
    currentCalculation.extras.push({
      name: "Płatności Internetowe (" + paymentsRange + ")",
      price: additionalCost.toFixed(2) + " zł",
    });
  }

  // Update calculation object
  currentCalculation.docs = docsRange;
  currentCalculation.basePrice = basePrice;
  currentCalculation.finalPrice = finalPrice;

  // Show results
  showResults();
}

function showResults() {
  // Populate results
  document.getElementById("result-type").textContent = currentCalculation.type;
  document.getElementById("result-docs").textContent = currentCalculation.docs;
  document.getElementById("result-base-price").textContent =
    currentCalculation.basePrice.toFixed(2) + " zł";

  // Show extras
  const extrasContainer = document.getElementById("result-extras");
  extrasContainer.innerHTML = "";

  if (currentCalculation.extras.length > 0) {
    currentCalculation.extras.forEach((extra) => {
      const extraElement = document.createElement("p");
      extraElement.innerHTML = `<strong>${extra.name}:</strong> ${extra.price}`;
      extrasContainer.appendChild(extraElement);
    });
  }

  // Show final price
  document.getElementById("final-price").textContent =
    currentCalculation.finalPrice.toFixed(2) + " zł";

  // Show result panel
  showPanel(resultPanel);
}
