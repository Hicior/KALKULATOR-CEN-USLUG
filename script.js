// Data tables from README
const kpirPriceTable = {
  "0-10": 380.0,
  "11-20": 480.0,
  "21-30": 540.0,
  "31-50": 800.0,
  "51-70": 1050.0,
  "71-100": 1500.0,
  "101-130": 1820.0,
  "131-165": 2310.0,
  "166-200": 2600.0,
  "201-250": 3250.0,
  "251-300": 3600.0,
  "301-350": 4200.0,
  "351-400": 4400.0,
  "401-450": 4950.0,
  "451-500": 5000.0,
};

const khPriceTable = {
  "0-20": 1380.0,
  "21-40": 1720.0,
  "41-60": 2100.0,
  "61-80": 2320.0,
  "81-100": 2500.0,
  "101-120": 2760.0,
  "121-150": 3300.0,
  "150-200": 4200.0,
  "201-250": 5000.0,
  "251-300": 6000.0,
  "301-350": 6650.0,
  "351-400": 7600.0,
  "401-450": 8100.0,
  "451-500": 9000.0,
};

// DOM elements
const mainPanel = document.getElementById("main-panel");
const resultPanel = document.getElementById("result-panel");
const kpirCard = document.getElementById("kpir-button");
const khCard = document.getElementById("kh-button");

// KPIR panels
const kpirFormPanel = document.getElementById("kpir-form-panel");
const kpirDocsPanel = document.getElementById("kpir-docs-panel");
const kpirProceduresPanel = document.getElementById("kpir-procedures-panel");
const kpirKadryPanel = document.getElementById("kpir-kadry-panel");

// KH panels
const khFormPanel = document.getElementById("kh-form-panel");
const khDocsPanel = document.getElementById("kh-docs-panel");
const khActivitiesPanel = document.getElementById("kh-activities-panel");
const khProceduresPanel = document.getElementById("kh-procedures-panel");
const khKadryPanel = document.getElementById("kh-kadry-panel");

// Variables to store calculation data
let currentCalculation = {
  type: "",
  businessForm: "",
  partnersCount: 1,
  docs: "",
  activities: [],
  basePrice: 0,
  extras: [],
  finalPrice: 0,
  totalAdditionalPercentage: 0,
  // Kadry data
  hasEmployees: false,
  wantsPayroll: false,
  employeesCount: 0,
  contractorsCount: 0,
  boardCount: 0,
  hasPfron: false,
  pfronEmployees: 0,
  payrollPrice: 0,
};

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
});

function setupEventListeners() {
  // Main panel cards
  kpirCard.addEventListener("click", () => startKpirWorkflow());
  khCard.addEventListener("click", () => startKhWorkflow());

  // KPIR workflow
  document.getElementById("back-from-kpir-form").addEventListener("click", () => showPanel(mainPanel));
  document.getElementById("kpir-form-next").addEventListener("click", () => validateAndProceedKpirForm());
  
  document.getElementById("back-from-kpir-docs").addEventListener("click", () => showPanel(kpirFormPanel));
  document.getElementById("kpir-docs-next").addEventListener("click", () => validateAndProceedKpirDocs());
  
  document.getElementById("back-from-kpir-procedures").addEventListener("click", () => showPanel(kpirDocsPanel));
  document.getElementById("kpir-procedures-next").addEventListener("click", () => showPanel(kpirKadryPanel));
  
  document.getElementById("back-from-kpir-kadry").addEventListener("click", () => showPanel(kpirProceduresPanel));
  document.getElementById("kpir-calculate").addEventListener("click", () => validateAndCalculateKpir());

  // KH workflow
  document.getElementById("back-from-kh-form").addEventListener("click", () => showPanel(mainPanel));
  document.getElementById("kh-form-next").addEventListener("click", () => validateAndProceedKhForm());
  
  document.getElementById("back-from-kh-docs").addEventListener("click", () => showPanel(khFormPanel));
  document.getElementById("kh-docs-next").addEventListener("click", () => validateAndProceedKhDocs());
  
  document.getElementById("back-from-kh-activities").addEventListener("click", () => showPanel(khDocsPanel));
  document.getElementById("kh-activities-next").addEventListener("click", () => validateAndProceedKhActivities());
  
  document.getElementById("back-from-kh-procedures").addEventListener("click", () => showPanel(khActivitiesPanel));
  document.getElementById("kh-procedures-next").addEventListener("click", () => showPanel(khKadryPanel));
  
  document.getElementById("back-from-kh-kadry").addEventListener("click", () => showPanel(khProceduresPanel));
  document.getElementById("kh-calculate").addEventListener("click", () => validateAndCalculateKh());

  // Calculate Again button
  document.getElementById("calculate-again").addEventListener("click", () => resetAndGoHome());

  // Partner input visibility for KPIR
  document.querySelectorAll('input[name="kpir-business-form"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKpirPartnersInput());
  });

  // Kadry form interactions for KPIR
  document.querySelectorAll('input[name="kpir-has-employees"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKpirPayrollQuestions());
  });
  
  document.querySelectorAll('input[name="kpir-wants-payroll"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKpirPayrollDetails());
  });
  
  document.getElementById("kpir-employees-count").addEventListener("input", () => toggleKpirPfronQuestions());
  
  document.querySelectorAll('input[name="kpir-has-pfron"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKpirPfronCount());
  });

  // Kadry form interactions for KH
  document.querySelectorAll('input[name="kh-has-employees"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKhPayrollQuestions());
  });
  
  document.querySelectorAll('input[name="kh-wants-payroll"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKhPayrollDetails());
  });
  
  document.getElementById("kh-employees-count").addEventListener("input", () => toggleKhPfronQuestions());
  
  document.querySelectorAll('input[name="kh-has-pfron"]').forEach(radio => {
    radio.addEventListener("change", () => toggleKhPfronCount());
  });

  // Keyboard accessibility
  setupKeyboardNavigation();
}

function setupKeyboardNavigation() {
  [kpirCard, khCard].forEach(card => {
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function startKpirWorkflow() {
  resetCalculation();
  currentCalculation.type = "KPiR";
  selectAccountingType(kpirCard);
  showPanel(kpirFormPanel);
}

function startKhWorkflow() {
  resetCalculation();
  currentCalculation.type = "KH";
  selectAccountingType(khCard);
  showPanel(khFormPanel);
}

function selectAccountingType(selectedCard) {
  kpirCard.classList.remove("selected");
  khCard.classList.remove("selected");
  selectedCard.classList.add("selected");
}

function resetCalculation() {
  currentCalculation = {
    type: "",
    businessForm: "",
    partnersCount: 1,
    docs: "",
    activities: [],
    basePrice: 0,
    extras: [],
    finalPrice: 0,
    totalAdditionalPercentage: 0,
    // Kadry data
    hasEmployees: false,
    wantsPayroll: false,
    employeesCount: 0,
    contractorsCount: 0,
    boardCount: 0,
    hasPfron: false,
    pfronEmployees: 0,
    payrollPrice: 0,
  };
}

function resetAndGoHome() {
  resetCalculation();
  kpirCard.classList.remove("selected");
  khCard.classList.remove("selected");
  showPanel(mainPanel);
}

function showPanel(panel) {
  // Hide all panels
  [mainPanel, kpirFormPanel, kpirDocsPanel, kpirProceduresPanel, kpirKadryPanel,
   khFormPanel, khDocsPanel, khActivitiesPanel, khProceduresPanel, khKadryPanel, resultPanel].forEach(p => {
    p.classList.add("hidden");
  });

  // Show selected panel
  panel.classList.remove("hidden");
  panel.classList.add("fade-in");
  
  setTimeout(() => {
    panel.classList.remove("fade-in");
  }, 500);
}

// KPIR Workflow Functions
function toggleKpirPartnersInput() {
  const businessForm = document.querySelector('input[name="kpir-business-form"]:checked')?.value;
  const partnersInput = document.getElementById("kpir-partners-input");
  
  if (businessForm === "spolka-cywilna" || businessForm === "spolka-jawna") {
    partnersInput.classList.remove("hidden");
  } else {
    partnersInput.classList.add("hidden");
  }
}

function validateAndProceedKpirForm() {
  const businessForm = document.querySelector('input[name="kpir-business-form"]:checked');
  
  if (!businessForm) {
    alert("Proszę wybrać formę prowadzonej działalności gospodarczej.");
    return;
  }
  
  currentCalculation.businessForm = businessForm.value;
  
  if (businessForm.value === "spolka-cywilna" || businessForm.value === "spolka-jawna") {
    const partnersCount = parseInt(document.getElementById("kpir-partners-count").value) || 1;
    currentCalculation.partnersCount = Math.max(1, partnersCount);
  }
  
  showPanel(kpirDocsPanel);
}

function validateAndProceedKpirDocs() {
  const docs = document.getElementById("kpir-docs").value;
  
  if (!docs) {
    alert("Proszę wybrać przedział liczby dokumentów.");
    return;
  }
  
  currentCalculation.docs = docs;
  showPanel(kpirProceduresPanel);
}

// Kadry form interaction functions for KPIR
function toggleKpirPayrollQuestions() {
  const hasEmployees = document.querySelector('input[name="kpir-has-employees"]:checked')?.value;
  const payrollQuestion = document.getElementById("kpir-payroll-question");
  const payrollDetails = document.getElementById("kpir-payroll-details");
  
  if (hasEmployees === "tak") {
    payrollQuestion.classList.remove("hidden");
  } else {
    payrollQuestion.classList.add("hidden");
    payrollDetails.classList.add("hidden");
    // Reset payroll selections
    document.querySelectorAll('input[name="kpir-wants-payroll"]').forEach(radio => {
      radio.checked = false;
    });
  }
}

function toggleKpirPayrollDetails() {
  const wantsPayroll = document.querySelector('input[name="kpir-wants-payroll"]:checked')?.value;
  const payrollDetails = document.getElementById("kpir-payroll-details");
  
  if (wantsPayroll === "tak") {
    payrollDetails.classList.remove("hidden");
  } else {
    payrollDetails.classList.add("hidden");
  }
}

function toggleKpirPfronQuestions() {
  const employeesCount = parseInt(document.getElementById("kpir-employees-count").value) || 0;
  const pfronQuestion = document.getElementById("kpir-pfron-question");
  const pfronCount = document.getElementById("kpir-pfron-count");
  
  if (employeesCount > 0) {
    pfronQuestion.classList.remove("hidden");
  } else {
    pfronQuestion.classList.add("hidden");
    pfronCount.classList.add("hidden");
    // Reset PFRON selections
    document.querySelectorAll('input[name="kpir-has-pfron"]').forEach(radio => {
      radio.checked = false;
    });
    document.getElementById("kpir-pfron-employees").value = 0;
  }
}

function toggleKpirPfronCount() {
  const hasPfron = document.querySelector('input[name="kpir-has-pfron"]:checked')?.value;
  const pfronCount = document.getElementById("kpir-pfron-count");
  
  if (hasPfron === "tak") {
    pfronCount.classList.remove("hidden");
  } else {
    pfronCount.classList.add("hidden");
    document.getElementById("kpir-pfron-employees").value = 0;
  }
}

function validateAndCalculateKpir() {
  const hasEmployees = document.querySelector('input[name="kpir-has-employees"]:checked')?.value;
  
  if (!hasEmployees) {
    alert("Proszę odpowiedzieć na pytanie o pracowników.");
    return;
  }
  
  currentCalculation.hasEmployees = hasEmployees === "tak";
  
  if (currentCalculation.hasEmployees) {
    const wantsPayroll = document.querySelector('input[name="kpir-wants-payroll"]:checked')?.value;
    
    if (!wantsPayroll) {
      alert("Proszę odpowiedzieć na pytanie o usługę kadrowo-płacową.");
      return;
    }
    
    currentCalculation.wantsPayroll = wantsPayroll === "tak";
    
    if (currentCalculation.wantsPayroll) {
      currentCalculation.employeesCount = parseInt(document.getElementById("kpir-employees-count").value) || 0;
      currentCalculation.contractorsCount = parseInt(document.getElementById("kpir-contractors-count").value) || 0;
      currentCalculation.boardCount = parseInt(document.getElementById("kpir-board-count").value) || 0;
      
      if (currentCalculation.employeesCount > 0) {
        const hasPfron = document.querySelector('input[name="kpir-has-pfron"]:checked')?.value;
        if (!hasPfron) {
          alert("Proszę odpowiedzieć na pytanie o PFRON.");
          return;
        }
        currentCalculation.hasPfron = hasPfron === "tak";
        currentCalculation.pfronEmployees = parseInt(document.getElementById("kpir-pfron-employees").value) || 0;
      }
    }
  }
  
  calculateKpir();
}

function calculatePayrollPrice() {
  if (!currentCalculation.wantsPayroll) {
    currentCalculation.payrollPrice = 0;
    return;
  }
  
  let payrollPrice = 0;
  
  // Employee pricing: 120 zł per employee
  payrollPrice += currentCalculation.employeesCount * 120;
  
  // Contractor pricing: 80 zł per contractor
  payrollPrice += currentCalculation.contractorsCount * 80;
  
  // Board member pricing: 120 zł per board member
  payrollPrice += currentCalculation.boardCount * 120;
  
  // PFRON employees are still counted at full price (no discount)
  
  currentCalculation.payrollPrice = payrollPrice;
}

function calculateKpir() {
  currentCalculation.extras = [];
  let basePrice = kpirPriceTable[currentCalculation.docs];
  let totalAdditionalPercentage = 0;
  let includedBurdens = [];

  // Calculate partner percentage (10% per partner)
  if (currentCalculation.partnersCount > 1) {
    const partnerPercentage = 10 * currentCalculation.partnersCount;
    totalAdditionalPercentage += partnerPercentage;
    includedBurdens.push(`Dodatkowi wspólnicy (+${partnerPercentage}%)`);
  }

  // Calculate additional percentage for procedures
  let proceduresPercentage = 0;

  // VAT Proportion - 10%
  if (document.querySelector('input[name="kpir-vat-proportion"]:checked').value === "tak") {
    proceduresPercentage += 10;
    includedBurdens.push("Proporcja VAT (+10%)");
  }

  // VAT OSS - 20%
  if (document.querySelector('input[name="kpir-vat-oss"]:checked').value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("VAT OSS (+20%)");
  }

  // VAT Margin - 20%
  if (document.querySelector('input[name="kpir-vat-margin"]:checked').value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("VAT marża (+20%)");
  }

  // JPK_FA - 20% if NO
  if (document.querySelector('input[name="kpir-jpk-fa"]:checked').value === "nie") {
    proceduresPercentage += 20;
    includedBurdens.push("Brak JPK_FA (+20%)");
  }

  totalAdditionalPercentage += proceduresPercentage;

  // Cap total additional percentage at 40% maximum
  const originalTotalPercentage = totalAdditionalPercentage;
  totalAdditionalPercentage = Math.min(totalAdditionalPercentage, 40);

  let finalPrice = basePrice;

  // Apply the capped total additional percentage
  if (totalAdditionalPercentage > 0) {
    const totalAdditionalCost = basePrice * (totalAdditionalPercentage / 100);
    finalPrice += totalAdditionalCost;

    // Show single "Procedury szczególne" card with all burdens listed
    const burdensText = includedBurdens.join(", ");
    const displayPercentage = totalAdditionalPercentage;
    
    currentCalculation.extras.push({
      name: `Procedury szczególne (+${displayPercentage}%)`,
      price: totalAdditionalCost.toFixed(2) + " zł",
      details: burdensText
    });
  }

  currentCalculation.basePrice = basePrice;
  
  // Calculate payroll price
  calculatePayrollPrice();
  
  // Final price includes both accounting and payroll services
  currentCalculation.finalPrice = finalPrice + currentCalculation.payrollPrice;
  currentCalculation.totalAdditionalPercentage = totalAdditionalPercentage;
  showResults();
}

// KH Workflow Functions
function validateAndProceedKhForm() {
  const businessForm = document.querySelector('input[name="kh-business-form"]:checked');
  
  if (!businessForm) {
    alert("Proszę wybrać formę prowadzonej działalności gospodarczej.");
    return;
  }
  
  currentCalculation.businessForm = businessForm.value;
  showPanel(khDocsPanel);
}

function validateAndProceedKhDocs() {
  const docs = document.getElementById("kh-docs").value;
  
  if (!docs) {
    alert("Proszę wybrać przedział liczby dokumentów.");
    return;
  }
  
  currentCalculation.docs = docs;
  showPanel(khActivitiesPanel);
}

function validateAndProceedKhActivities() {
  const selectedActivities = document.querySelectorAll('input[name="kh-activity"]:checked');
  currentCalculation.activities = Array.from(selectedActivities).map(cb => cb.value);
  showPanel(khProceduresPanel);
}

// Kadry form interaction functions for KH
function toggleKhPayrollQuestions() {
  const hasEmployees = document.querySelector('input[name="kh-has-employees"]:checked')?.value;
  const payrollQuestion = document.getElementById("kh-payroll-question");
  const payrollDetails = document.getElementById("kh-payroll-details");
  
  if (hasEmployees === "tak") {
    payrollQuestion.classList.remove("hidden");
  } else {
    payrollQuestion.classList.add("hidden");
    payrollDetails.classList.add("hidden");
    // Reset payroll selections
    document.querySelectorAll('input[name="kh-wants-payroll"]').forEach(radio => {
      radio.checked = false;
    });
  }
}

function toggleKhPayrollDetails() {
  const wantsPayroll = document.querySelector('input[name="kh-wants-payroll"]:checked')?.value;
  const payrollDetails = document.getElementById("kh-payroll-details");
  
  if (wantsPayroll === "tak") {
    payrollDetails.classList.remove("hidden");
  } else {
    payrollDetails.classList.add("hidden");
  }
}

function toggleKhPfronQuestions() {
  const employeesCount = parseInt(document.getElementById("kh-employees-count").value) || 0;
  const pfronQuestion = document.getElementById("kh-pfron-question");
  const pfronCount = document.getElementById("kh-pfron-count");
  
  if (employeesCount > 0) {
    pfronQuestion.classList.remove("hidden");
  } else {
    pfronQuestion.classList.add("hidden");
    pfronCount.classList.add("hidden");
    // Reset PFRON selections
    document.querySelectorAll('input[name="kh-has-pfron"]').forEach(radio => {
      radio.checked = false;
    });
    document.getElementById("kh-pfron-employees").value = 0;
  }
}

function toggleKhPfronCount() {
  const hasPfron = document.querySelector('input[name="kh-has-pfron"]:checked')?.value;
  const pfronCount = document.getElementById("kh-pfron-count");
  
  if (hasPfron === "tak") {
    pfronCount.classList.remove("hidden");
  } else {
    pfronCount.classList.add("hidden");
    document.getElementById("kh-pfron-employees").value = 0;
  }
}

function validateAndCalculateKh() {
  const hasEmployees = document.querySelector('input[name="kh-has-employees"]:checked')?.value;
  
  if (!hasEmployees) {
    alert("Proszę odpowiedzieć na pytanie o pracowników.");
    return;
  }
  
  currentCalculation.hasEmployees = hasEmployees === "tak";
  
  if (currentCalculation.hasEmployees) {
    const wantsPayroll = document.querySelector('input[name="kh-wants-payroll"]:checked')?.value;
    
    if (!wantsPayroll) {
      alert("Proszę odpowiedzieć na pytanie o usługę kadrowo-płacową.");
      return;
    }
    
    currentCalculation.wantsPayroll = wantsPayroll === "tak";
    
    if (currentCalculation.wantsPayroll) {
      currentCalculation.employeesCount = parseInt(document.getElementById("kh-employees-count").value) || 0;
      currentCalculation.contractorsCount = parseInt(document.getElementById("kh-contractors-count").value) || 0;
      currentCalculation.boardCount = parseInt(document.getElementById("kh-board-count").value) || 0;
      
      if (currentCalculation.employeesCount > 0) {
        const hasPfron = document.querySelector('input[name="kh-has-pfron"]:checked')?.value;
        if (!hasPfron) {
          alert("Proszę odpowiedzieć na pytanie o PFRON.");
          return;
        }
        currentCalculation.hasPfron = hasPfron === "tak";
        currentCalculation.pfronEmployees = parseInt(document.getElementById("kh-pfron-employees").value) || 0;
      }
    }
  }
  
  calculateKh();
}

function calculateKh() {
  currentCalculation.extras = [];
  let basePrice = khPriceTable[currentCalculation.docs];
  let totalAdditionalPercentage = 0;
  let includedBurdens = [];

  // Calculate activity-based percentages
  let activitiesPercentage = 0;

  currentCalculation.activities.forEach(activity => {
    let additionalPercentage = 0;
    let activityName = "";

    switch (activity) {
      case "uslugi-budowlane":
        additionalPercentage = 20; // 20%
        activityName = "Usługi budowlane (+20%)";
        break;
      case "dzialalnosc-deweloperska":
        additionalPercentage = 20; // 20%
        activityName = "Działalność deweloperska (+20%)";
        break;
      case "produkcja":
        additionalPercentage = 30; // 30%
        activityName = "Produkcja (+30%)";
        break;
      case "transport":
        additionalPercentage = 20; // 20%
        activityName = "Transport (+20%)";
        break;
    }

    if (additionalPercentage > 0) {
      activitiesPercentage += additionalPercentage;
      includedBurdens.push(activityName);
    }
  });

  totalAdditionalPercentage += activitiesPercentage;

  // Calculate additional percentage for procedures
  let proceduresPercentage = 0;

  // Estonian CIT - 20%
  if (document.querySelector('input[name="kh-estonian-cit"]:checked').value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("Estoński CIT (+20%)");
  }

  // VAT Proportion - 10%
  if (document.querySelector('input[name="kh-vat-proportion"]:checked').value === "tak") {
    proceduresPercentage += 10;
    includedBurdens.push("Proporcja VAT (+10%)");
  }

  // VAT OSS - 10%
  if (document.querySelector('input[name="kh-vat-oss"]:checked').value === "tak") {
    proceduresPercentage += 10;
    includedBurdens.push("VAT OSS (+10%)");
  }

  // VAT Margin - 20%
  if (document.querySelector('input[name="kh-vat-margin"]:checked').value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("VAT marża (+20%)");
  }

  // MT940 - 20% if NO
  if (document.querySelector('input[name="kh-mt940"]:checked').value === "nie") {
    proceduresPercentage += 20;
    includedBurdens.push("Brak MT940 (+20%)");
  }

  // JPK_FA - 20% if NO
  if (document.querySelector('input[name="kh-jpk-fa"]:checked').value === "nie") {
    proceduresPercentage += 20;
    includedBurdens.push("Brak JPK_FA (+20%)");
  }

  totalAdditionalPercentage += proceduresPercentage;

  // Cap total additional percentage at 40% maximum
  const originalTotalPercentage = totalAdditionalPercentage;
  totalAdditionalPercentage = Math.min(totalAdditionalPercentage, 40);

  let finalPrice = basePrice;

  // Apply the capped total additional percentage
  if (totalAdditionalPercentage > 0) {
    const totalAdditionalCost = basePrice * (totalAdditionalPercentage / 100);
    finalPrice += totalAdditionalCost;

    // Show single "Procedury szczególne" card with all burdens listed
    const burdensText = includedBurdens.join(", ");
    const displayPercentage = totalAdditionalPercentage;
    
    currentCalculation.extras.push({
      name: `Procedury szczególne (+${displayPercentage}%)`,
      price: totalAdditionalCost.toFixed(2) + " zł",
      details: burdensText
    });
  }

  currentCalculation.basePrice = basePrice;
  
  // Calculate payroll price
  calculatePayrollPrice();
  
  // Final price includes both accounting and payroll services
  currentCalculation.finalPrice = finalPrice + currentCalculation.payrollPrice;
  currentCalculation.totalAdditionalPercentage = totalAdditionalPercentage;
  showResults();
}

function getBusinessFormDisplayName(form) {
  const displayNames = {
    "jednoosobowa": "Jednoosobowa działalność gospodarcza",
    "spolka-cywilna": "Spółka Cywilna",
    "spolka-jawna": "Spółka Jawna",
    "sp-zoo": "Spółka z ograniczoną odpowiedzialnością",
    "spolka-komandytowa": "Spółka komandytowa",
    "spolka-komandytowo-akcyjna": "Spółka komandytowo-akcyjna",
    "fundacja": "Fundacja",
    "stowarzyszenie": "Stowarzyszenie"
  };
  return displayNames[form] || form;
}

function showResults() {
  // Calculate accounting service price (base price + extras)
  const accountingPrice = currentCalculation.basePrice + (currentCalculation.extras.reduce((sum, extra) => {
    return sum + parseFloat(extra.price.replace(' zł', ''));
  }, 0));

  // Populate accounting services section
  document.getElementById("result-type").textContent = currentCalculation.type;
  document.getElementById("result-business-form").textContent = getBusinessFormDisplayName(currentCalculation.businessForm);
  document.getElementById("result-docs").textContent = currentCalculation.docs;
  document.getElementById("result-base-price").textContent = currentCalculation.basePrice.toFixed(2) + " zł";

  // Show accounting extras
  const extrasContainer = document.getElementById("result-extras");
  extrasContainer.innerHTML = "";

  if (currentCalculation.extras.length > 0) {
    currentCalculation.extras.forEach((extra) => {
      const extraElement = document.createElement("div");
      extraElement.className = "detail-item";
      extraElement.style.cssText = "display: block; padding: 16px; margin-bottom: 8px; background: var(--color-accent); color: var(--color-accent-content); border-radius: var(--radius-box);";
      
      let extraHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 500;">${extra.name}</span>
          <span style="font-weight: 600; font-size: 1.1em;">${extra.price}</span>
        </div>
      `;
      
      // Add details if they exist (list of included burdens)
      if (extra.details) {
        extraHTML += `
          <div style="font-size: 0.9em; opacity: 0.9; line-height: 1.4; margin-bottom: 8px;">
            ${extra.details}
          </div>
        `;
      }
      
      // Add note about 40% maximum only when totalAdditionalPercentage is at least 40%
      if (currentCalculation.totalAdditionalPercentage >= 40) {
        extraHTML += `
          <div style="font-size: 0.8em; opacity: 0.7; font-style: italic;">
            Maksymalne dodatkowe obciążenie wynosi 40%
          </div>
        `;
      }
      
      extraElement.innerHTML = extraHTML;
      extrasContainer.appendChild(extraElement);
    });
  }

  // Show accounting total
  document.getElementById("accounting-total").textContent = accountingPrice.toFixed(2) + " zł";

  // Handle payroll section
  const payrollSection = document.getElementById("payroll-section");
  if (currentCalculation.wantsPayroll) {
    payrollSection.classList.remove("hidden");
    
    // Populate payroll details
    document.getElementById("result-employees").textContent = currentCalculation.employeesCount.toString();
    document.getElementById("result-contractors").textContent = currentCalculation.contractorsCount.toString();
    document.getElementById("result-board").textContent = currentCalculation.boardCount.toString();
    
    // Handle PFRON display
    const pfronDetail = document.getElementById("pfron-detail");
    if (currentCalculation.employeesCount > 0) {
      pfronDetail.classList.remove("hidden");
      document.getElementById("result-pfron").textContent = currentCalculation.pfronEmployees.toString();
    } else {
      pfronDetail.classList.add("hidden");
    }
    
    // Show payroll pricing as single item
    const payrollExtrasContainer = document.getElementById("payroll-extras");
    payrollExtrasContainer.innerHTML = "";
    
    // Create a consolidated payroll description
    let payrollDescription = [];
    
    if (currentCalculation.employeesCount > 0) {
      payrollDescription.push(`Pracownicy (${currentCalculation.employeesCount} × 120 zł)`);
    }
    
    if (currentCalculation.contractorsCount > 0) {
      payrollDescription.push(`Zleceniobiorcy (${currentCalculation.contractorsCount} × 80 zł)`);
    }
    
    if (currentCalculation.boardCount > 0) {
      payrollDescription.push(`Członkowie zarządu (${currentCalculation.boardCount} × 120 zł)`);
    }
    
    if (payrollDescription.length > 0) {
      payrollExtrasContainer.innerHTML = `
        <div class="detail-item" style="display: block; padding: 16px; margin-bottom: 8px; background: var(--color-accent); color: var(--color-accent-content); border-radius: var(--radius-box);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 500;">Usługi kadrowo-płacowe</span>
            <span style="font-weight: 600; font-size: 1.1em;">${currentCalculation.payrollPrice.toFixed(2)} zł</span>
          </div>
          <div style="font-size: 0.9em; opacity: 0.9; line-height: 1.4;">
            ${payrollDescription.join(', ')}
          </div>
        </div>
      `;
    }
    
    // Show payroll total
    document.getElementById("payroll-total").textContent = currentCalculation.payrollPrice.toFixed(2) + " zł";
  } else {
    payrollSection.classList.add("hidden");
  }

  // Show final price
  document.getElementById("final-price").textContent = currentCalculation.finalPrice.toFixed(2) + " zł";

  // Show result panel
  showPanel(resultPanel);
}
