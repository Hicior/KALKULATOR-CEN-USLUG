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

// Special pricing for Spółka akcyjna and Prosta spółka akcyjna
const khSpecialPriceTable = {
  "0-20": 2990.0,
  "21-40": 3910.0,
  "41-60": 4715.0,
  "61-80": 5750.0,
  "81-100": 6555.0,
  "101-120": 7015.0,
  "121-150": 7705.0,
  "150-200": 8855.0,
  "201-250": 10005.0,
  "251-300": 11155.0,
  "301-350": 12305.0,
  "351-400": 13455.0,
  "401-450": 14605.0,
  "451-500": 15755.0,
};

// Special pricing for Fundacja
const khFundacjaPriceTable = {
  "0-20": 1380.0,
  "21-40": 1720.0,
  "41-60": 2070.0,
  "61-80": 2300.0,
  "81-100": 2530.0,
  "101-120": 2730.0,
  "121-150": 2830.0,
  "150-200": 3030.0,
  "201-250": 3530.0,
  "251-300": 4030.0,
  "301-350": 4530.0,
  "351-400": 5030.0,
  "401-450": 5530.0,
  "451-500": 6030.0,
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

// Validation utilities
const ValidationUtils = {
  // Show validation error
  showError(element, message, scrollToElement = true) {
    this.clearError(element);
    
    // Add error class to element
    element.classList.add('error');
    
    // Add error class to parent form group if exists
    const formGroup = element.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.setAttribute('data-validation-error', 'true');
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    // Insert error message after the element
    if (element.parentNode) {
      element.parentNode.insertBefore(errorElement, element.nextSibling);
    }
    
    // Add shake animation
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
    
    // Scroll to element if needed
    if (scrollToElement) {
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
    
    return false;
  },
  
  // Clear validation error
  clearError(element) {
    // Remove error classes
    element.classList.remove('error');
    
    // Remove error class from parent form group
    const formGroup = element.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
    
    // Remove existing error messages
    const existingErrors = element.parentNode?.querySelectorAll('[data-validation-error="true"]');
    if (existingErrors) {
      existingErrors.forEach(error => error.remove());
    }
  },
  
  // Clear all validation errors in a container
  clearAllErrors(container) {
    const errorElements = container.querySelectorAll('.error');
    errorElements.forEach(element => {
      this.clearError(element);
    });
    
    const errorMessages = container.querySelectorAll('[data-validation-error="true"]');
    errorMessages.forEach(message => message.remove());
    
    const errorGroups = container.querySelectorAll('.has-error');
    errorGroups.forEach(group => group.classList.remove('has-error'));
  },
  
  // Validate radio group
  validateRadioGroup(name, errorMessage, container = document) {
    const radioGroup = container.querySelector(`input[name="${name}"]`);
    const checked = container.querySelector(`input[name="${name}"]:checked`);
    
    if (!checked && radioGroup) {
      const radioContainer = radioGroup.closest('.radio-group') || radioGroup.closest('.form-group');
      if (radioContainer) {
        return this.showError(radioContainer, errorMessage);
      }
    }
    
    if (radioGroup) {
      const radioContainer = radioGroup.closest('.radio-group') || radioGroup.closest('.form-group');
      if (radioContainer) {
        this.clearError(radioContainer);
      }
    }
    
    return true;
  },
  
  // Validate select dropdown
  validateSelect(selectElement, errorMessage) {
    if (!selectElement.value) {
      return this.showError(selectElement, errorMessage);
    }
    
    this.clearError(selectElement);
    return true;
  },
  
  // Validate number input
  validateNumber(inputElement, errorMessage, min = null, max = null) {
    const value = parseInt(inputElement.value) || 0;
    
    if (min !== null && value < min) {
      return this.showError(inputElement, errorMessage);
    }
    
    if (max !== null && value > max) {
      return this.showError(inputElement, errorMessage);
    }
    
    this.clearError(inputElement);
    return true;
  },
  

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
  
  // Download PDF button
  document.getElementById("download-pdf").addEventListener("click", () => generatePDF());

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
  
  // Real-time validation setup
  setupRealTimeValidation();
}

function setupRealTimeValidation() {
  // Clear validation errors when user starts interacting with radio buttons
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const container = this.closest('.radio-group') || this.closest('.form-group');
      if (container) {
        ValidationUtils.clearError(container);
      }
    });
  });
  
  // Clear validation errors when user starts interacting with checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const activitiesGrid = document.querySelector('.activities-grid');
      if (activitiesGrid && activitiesGrid.classList.contains('error')) {
        ValidationUtils.clearError(activitiesGrid);
        activitiesGrid.classList.remove('error');
      }
    });
  });
  
  // Clear validation errors when user starts typing in select elements
  document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', function() {
      ValidationUtils.clearError(this);
    });
  });
  
  // Real-time validation for number inputs
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
      ValidationUtils.clearError(this);
      
      // Real-time validation for partners count
      if (this.id === 'kpir-partners-count' || this.id === 'kh-partners-count') {
        const value = parseInt(this.value) || 0;
        if (value > 0 && value < 2) {
          ValidationUtils.showError(this, "Liczba wspólników musi być większa niż 1.", false);
        }
      }
      
             // Real-time validation for PFRON employees
       if (this.id === 'kpir-pfron-employees') {
         const totalEmployees = parseInt(document.getElementById('kpir-employees-count').value) || 0;
         const pfronCount = parseInt(this.value) || 0;
         const hasPfronSelected = document.querySelector('input[name="kpir-has-pfron"]:checked')?.value === 'tak';
         
         if (hasPfronSelected && pfronCount === 0 && this.value !== '') {
           ValidationUtils.showError(this, "Proszę wskazać liczbę pracowników objętych PFRON (minimum 1).", false);
         } else if (pfronCount > totalEmployees) {
           ValidationUtils.showError(this, "Liczba pracowników PFRON nie może być większa niż całkowita liczba pracowników.", false);
         }
       }
       
       if (this.id === 'kh-pfron-employees') {
         const totalEmployees = parseInt(document.getElementById('kh-employees-count').value) || 0;
         const pfronCount = parseInt(this.value) || 0;
         const hasPfronSelected = document.querySelector('input[name="kh-has-pfron"]:checked')?.value === 'tak';
         
         if (hasPfronSelected && pfronCount === 0 && this.value !== '') {
           ValidationUtils.showError(this, "Proszę wskazać liczbę pracowników objętych PFRON (minimum 1).", false);
         } else if (pfronCount > totalEmployees) {
           ValidationUtils.showError(this, "Liczba pracowników PFRON nie może być większa niż całkowita liczba pracowników.", false);
         }
       }
    });
    
    // Prevent negative values
    input.addEventListener('keydown', function(e) {
      // Allow: backspace, delete, tab, escape, enter
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          // Allow: home, end, left, right, down, up
          (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  });
  
  // Clear all errors when navigating between panels
  document.querySelectorAll('button[id*="back-from"]').forEach(button => {
    button.addEventListener('click', function() {
      setTimeout(() => {
        const allPanels = document.querySelectorAll('.panel');
        allPanels.forEach(panel => {
          if (!panel.classList.contains('hidden')) {
            ValidationUtils.clearAllErrors(panel);
          }
        });
      }, 100);
    });
  });
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
  
  // Clear all validation errors from all panels
  const allPanels = document.querySelectorAll('.panel');
  allPanels.forEach(panel => {
    ValidationUtils.clearAllErrors(panel);
  });
  
  // Reset all form values
  document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
  document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
  document.querySelectorAll('input[type="number"]').forEach(input => input.value = input.defaultValue || '0');
  
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
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(kpirFormPanel);
  
  const businessForm = document.querySelector('input[name="kpir-business-form"]:checked');
  
  if (!ValidationUtils.validateRadioGroup("kpir-business-form", "Proszę wybrać formę prowadzonej działalności gospodarczej.", kpirFormPanel)) {
    return;
  }
  
  currentCalculation.businessForm = businessForm.value;
  
  if (businessForm.value === "spolka-cywilna" || businessForm.value === "spolka-jawna") {
    const partnersCountInput = document.getElementById("kpir-partners-count");
    const partnersCount = parseInt(partnersCountInput.value) || 2;
    
    if (!ValidationUtils.validateNumber(partnersCountInput, "Liczba wspólników musi być większa niż 1.", 2)) {
      return;
    }
    
    currentCalculation.partnersCount = Math.max(2, partnersCount);
  }
  
  showPanel(kpirDocsPanel);
}

function validateAndProceedKpirDocs() {
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(kpirDocsPanel);
  
  const docsSelect = document.getElementById("kpir-docs");
  
  if (!ValidationUtils.validateSelect(docsSelect, "Proszę wybrać przedział liczby dokumentów.")) {
    return;
  }
  
  currentCalculation.docs = docsSelect.value;
  
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
  const pfronInput = document.getElementById("kpir-pfron-employees");
  
  if (hasPfron === "tak") {
    pfronCount.classList.remove("hidden");
    // Set default value to 1 when PFRON is selected
    if (pfronInput.value === "0" || pfronInput.value === "") {
      pfronInput.value = 1;
    }
  } else {
    pfronCount.classList.add("hidden");
    pfronInput.value = 0;
    ValidationUtils.clearError(pfronInput);
  }
}

function validateAndCalculateKpir() {
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(kpirKadryPanel);
  
  let validationPassed = true;
  
  // Validate has employees question
  if (!ValidationUtils.validateRadioGroup("kpir-has-employees", "Proszę odpowiedzieć na pytanie o pracowników.", kpirKadryPanel)) {
    validationPassed = false;
  }
  
  const hasEmployees = document.querySelector('input[name="kpir-has-employees"]:checked')?.value;
  currentCalculation.hasEmployees = hasEmployees === "tak";
  
  if (currentCalculation.hasEmployees) {
    // Validate wants payroll question
    if (!ValidationUtils.validateRadioGroup("kpir-wants-payroll", "Proszę odpowiedzieć na pytanie o usługę kadrowo-płacową.", kpirKadryPanel)) {
      validationPassed = false;
    }
    
    const wantsPayroll = document.querySelector('input[name="kpir-wants-payroll"]:checked')?.value;
    currentCalculation.wantsPayroll = wantsPayroll === "tak";
    
    if (currentCalculation.wantsPayroll) {
      // Validate number inputs
      const employeesInput = document.getElementById("kpir-employees-count");
      const contractorsInput = document.getElementById("kpir-contractors-count");
      const boardInput = document.getElementById("kpir-board-count");
      
      // Get values
      currentCalculation.employeesCount = parseInt(employeesInput.value) || 0;
      currentCalculation.contractorsCount = parseInt(contractorsInput.value) || 0;
      currentCalculation.boardCount = parseInt(boardInput.value) || 0;
      
      // Validate that at least one person is selected
      const totalPeople = currentCalculation.employeesCount + currentCalculation.contractorsCount + currentCalculation.boardCount;
      if (totalPeople === 0) {
        ValidationUtils.showError(employeesInput, "Proszę wskazać liczbę osób do rozliczenia (przynajmniej 1 osoba).");
        validationPassed = false;
      }
      
      // Validate PFRON if there are employees
      if (currentCalculation.employeesCount > 0) {
        if (!ValidationUtils.validateRadioGroup("kpir-has-pfron", "Proszę odpowiedzieć na pytanie o PFRON.", kpirKadryPanel)) {
          validationPassed = false;
        } else {
          const hasPfron = document.querySelector('input[name="kpir-has-pfron"]:checked')?.value;
          currentCalculation.hasPfron = hasPfron === "tak";
          
          if (currentCalculation.hasPfron) {
            const pfronInput = document.getElementById("kpir-pfron-employees");
            const pfronCount = parseInt(pfronInput.value) || 0;
            
            if (pfronCount === 0) {
              ValidationUtils.showError(pfronInput, "Proszę wskazać liczbę pracowników objętych PFRON (minimum 1).");
              validationPassed = false;
            } else if (pfronCount > currentCalculation.employeesCount) {
              ValidationUtils.showError(pfronInput, "Liczba pracowników PFRON nie może być większa niż całkowita liczba pracowników.");
              validationPassed = false;
            } else {
              currentCalculation.pfronEmployees = pfronCount;
            }
          } else {
            currentCalculation.pfronEmployees = 0;
          }
        }
      }
    }
  } else {
    currentCalculation.wantsPayroll = false;
    currentCalculation.employeesCount = 0;
    currentCalculation.contractorsCount = 0;
    currentCalculation.boardCount = 0;
    currentCalculation.hasPfron = false;
    currentCalculation.pfronEmployees = 0;
  }
  
  if (!validationPassed) {
    return;
  }
  
  calculateKpir();
}

function calculatePayrollPrice() {
  if (!currentCalculation.wantsPayroll) {
    currentCalculation.payrollPrice = 0;
    return;
  }
  
  let payrollPrice = 0;
  
  // Employee pricing calculation
  const regularEmployees = currentCalculation.employeesCount - currentCalculation.pfronEmployees;
  const pfronEmployees = currentCalculation.pfronEmployees;
  
  // Regular employees: 120 zł per employee
  payrollPrice += regularEmployees * 120;
  
  // PFRON employees: 200 zł per employee
  payrollPrice += pfronEmployees * 200;
  
  // Contractor pricing: 80 zł per contractor
  payrollPrice += currentCalculation.contractorsCount * 80;
  
  // Board member pricing: 80 zł per board member
  payrollPrice += currentCalculation.boardCount * 80;
  
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
  const vatProportionSelected = document.querySelector('input[name="kpir-vat-proportion"]:checked');
  if (vatProportionSelected && vatProportionSelected.value === "tak") {
    proceduresPercentage += 10;
    includedBurdens.push("Proporcja VAT (+10%)");
  }

  // VAT OSS - 20%
  const vatOssSelected = document.querySelector('input[name="kpir-vat-oss"]:checked');
  if (vatOssSelected && vatOssSelected.value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("VAT OSS (+20%)");
  }

  // VAT Margin - 20%
  const vatMarginSelected = document.querySelector('input[name="kpir-vat-margin"]:checked');
  if (vatMarginSelected && vatMarginSelected.value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("VAT marża (+20%)");
  }

  // JPK_FA - 20% if NO (only if selected)
  const jpkFaSelected = document.querySelector('input[name="kpir-jpk-fa"]:checked');
  if (jpkFaSelected && jpkFaSelected.value === "nie") {
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
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(khFormPanel);
  
  const businessForm = document.querySelector('input[name="kh-business-form"]:checked');
  
  if (!ValidationUtils.validateRadioGroup("kh-business-form", "Proszę wybrać formę prowadzonej działalności gospodarczej.", khFormPanel)) {
    return;
  }
  
  currentCalculation.businessForm = businessForm.value;
  
  showPanel(khDocsPanel);
}

function validateAndProceedKhDocs() {
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(khDocsPanel);
  
  const docsSelect = document.getElementById("kh-docs");
  
  if (!ValidationUtils.validateSelect(docsSelect, "Proszę wybrać przedział liczby dokumentów.")) {
    return;
  }
  
  currentCalculation.docs = docsSelect.value;
  
  showPanel(khActivitiesPanel);
}

function validateAndProceedKhActivities() {
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(khActivitiesPanel);
  
  const selectedActivities = document.querySelectorAll('input[name="kh-activity"]:checked');
  
  if (selectedActivities.length === 0) {
    const activitiesGrid = document.querySelector('.activities-grid');
    ValidationUtils.showError(activitiesGrid, "Proszę wybrać przynajmniej jeden rodzaj działalności gospodarczej.");
    activitiesGrid.classList.add('error');
    return;
  }
  
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
  const pfronInput = document.getElementById("kh-pfron-employees");
  
  if (hasPfron === "tak") {
    pfronCount.classList.remove("hidden");
    // Set default value to 1 when PFRON is selected
    if (pfronInput.value === "0" || pfronInput.value === "") {
      pfronInput.value = 1;
    }
  } else {
    pfronCount.classList.add("hidden");
    pfronInput.value = 0;
    ValidationUtils.clearError(pfronInput);
  }
}

function validateAndCalculateKh() {
  // Clear any existing errors in this panel
  ValidationUtils.clearAllErrors(khKadryPanel);
  
  let validationPassed = true;
  
  // Validate has employees question
  if (!ValidationUtils.validateRadioGroup("kh-has-employees", "Proszę odpowiedzieć na pytanie o pracowników.", khKadryPanel)) {
    validationPassed = false;
  }
  
  const hasEmployees = document.querySelector('input[name="kh-has-employees"]:checked')?.value;
  currentCalculation.hasEmployees = hasEmployees === "tak";
  
  if (currentCalculation.hasEmployees) {
    // Validate wants payroll question
    if (!ValidationUtils.validateRadioGroup("kh-wants-payroll", "Proszę odpowiedzieć na pytanie o usługę kadrowo-płacową.", khKadryPanel)) {
      validationPassed = false;
    }
    
    const wantsPayroll = document.querySelector('input[name="kh-wants-payroll"]:checked')?.value;
    currentCalculation.wantsPayroll = wantsPayroll === "tak";
    
    if (currentCalculation.wantsPayroll) {
      // Validate number inputs
      const employeesInput = document.getElementById("kh-employees-count");
      const contractorsInput = document.getElementById("kh-contractors-count");
      const boardInput = document.getElementById("kh-board-count");
      
      // Get values
      currentCalculation.employeesCount = parseInt(employeesInput.value) || 0;
      currentCalculation.contractorsCount = parseInt(contractorsInput.value) || 0;
      currentCalculation.boardCount = parseInt(boardInput.value) || 0;
      
      // Validate that at least one person is selected
      const totalPeople = currentCalculation.employeesCount + currentCalculation.contractorsCount + currentCalculation.boardCount;
      if (totalPeople === 0) {
        ValidationUtils.showError(employeesInput, "Proszę wskazać liczbę osób do rozliczenia (przynajmniej 1 osoba).");
        validationPassed = false;
      }
      
      // Validate PFRON if there are employees
      if (currentCalculation.employeesCount > 0) {
        if (!ValidationUtils.validateRadioGroup("kh-has-pfron", "Proszę odpowiedzieć na pytanie o PFRON.", khKadryPanel)) {
          validationPassed = false;
        } else {
          const hasPfron = document.querySelector('input[name="kh-has-pfron"]:checked')?.value;
          currentCalculation.hasPfron = hasPfron === "tak";
          
          if (currentCalculation.hasPfron) {
            const pfronInput = document.getElementById("kh-pfron-employees");
            const pfronCount = parseInt(pfronInput.value) || 0;
            
            if (pfronCount === 0) {
              ValidationUtils.showError(pfronInput, "Proszę wskazać liczbę pracowników objętych PFRON (minimum 1).");
              validationPassed = false;
            } else if (pfronCount > currentCalculation.employeesCount) {
              ValidationUtils.showError(pfronInput, "Liczba pracowników PFRON nie może być większa niż całkowita liczba pracowników.");
              validationPassed = false;
            } else {
              currentCalculation.pfronEmployees = pfronCount;
            }
          } else {
            currentCalculation.pfronEmployees = 0;
          }
        }
      }
    }
  } else {
    currentCalculation.wantsPayroll = false;
    currentCalculation.employeesCount = 0;
    currentCalculation.contractorsCount = 0;
    currentCalculation.boardCount = 0;
    currentCalculation.hasPfron = false;
    currentCalculation.pfronEmployees = 0;
  }
  
  if (!validationPassed) {
    return;
  }
  
  calculateKh();
}

function calculateKh() {
  currentCalculation.extras = [];
  
  // Use special pricing for different business forms
  let basePrice;
  if (currentCalculation.businessForm === "spolka-akcyjna" || 
      currentCalculation.businessForm === "prosta-spolka-akcyjna") {
    basePrice = khSpecialPriceTable[currentCalculation.docs];
  } else if (currentCalculation.businessForm === "fundacja") {
    basePrice = khFundacjaPriceTable[currentCalculation.docs];
  } else {
    basePrice = khPriceTable[currentCalculation.docs];
  }
  
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
  const estonianCitSelected = document.querySelector('input[name="kh-estonian-cit"]:checked');
  if (estonianCitSelected && estonianCitSelected.value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("Estoński CIT (+20%)");
  }

  // VAT Proportion - 10%
  const khVatProportionSelected = document.querySelector('input[name="kh-vat-proportion"]:checked');
  if (khVatProportionSelected && khVatProportionSelected.value === "tak") {
    proceduresPercentage += 10;
    includedBurdens.push("Proporcja VAT (+10%)");
  }

  // VAT OSS - 10%
  const khVatOssSelected = document.querySelector('input[name="kh-vat-oss"]:checked');
  if (khVatOssSelected && khVatOssSelected.value === "tak") {
    proceduresPercentage += 10;
    includedBurdens.push("VAT OSS (+10%)");
  }

  // VAT Margin - 20%
  const khVatMarginSelected = document.querySelector('input[name="kh-vat-margin"]:checked');
  if (khVatMarginSelected && khVatMarginSelected.value === "tak") {
    proceduresPercentage += 20;
    includedBurdens.push("VAT marża (+20%)");
  }

  // MT940 - 20% if NO (only if selected)
  const mt940Selected = document.querySelector('input[name="kh-mt940"]:checked');
  if (mt940Selected && mt940Selected.value === "nie") {
    proceduresPercentage += 20;
    includedBurdens.push("Brak MT940 (+20%)");
  }

  // JPK_FA - 20% if NO (only if selected)
  const khJpkFaSelected = document.querySelector('input[name="kh-jpk-fa"]:checked');
  if (khJpkFaSelected && khJpkFaSelected.value === "nie") {
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
    "stowarzyszenie": "Stowarzyszenie",
    "spolka-akcyjna": "Spółka akcyjna",
    "prosta-spolka-akcyjna": "Prosta spółka akcyjna"
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
      const regularEmployees = currentCalculation.employeesCount - currentCalculation.pfronEmployees;
      const pfronEmployees = currentCalculation.pfronEmployees;
      
      if (regularEmployees > 0) {
        payrollDescription.push(`Pracownicy (${regularEmployees} × 120 zł)`);
      }
      
      if (pfronEmployees > 0) {
        payrollDescription.push(`Pracownicy PFRON (${pfronEmployees} × 200 zł)`);
      }
    }
    
    if (currentCalculation.contractorsCount > 0) {
      payrollDescription.push(`Zleceniobiorcy (${currentCalculation.contractorsCount} × 80 zł)`);
    }
    
    if (currentCalculation.boardCount > 0) {
      payrollDescription.push(`Członkowie zarządu (${currentCalculation.boardCount} × 80 zł)`);
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

function generatePDF() {
  // Get jsPDF from the global window object
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Define colors and styling
  const primaryColor = [88, 134, 199]; // Converted from OKLCH primary color
  const secondaryColor = [102, 102, 102];
  const accentColor = [79, 172, 154];
  
  let yPosition = 30;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = 8;
  const sectionSpacing = 15;
  
  // Helper function to handle Polish characters - using reliable ASCII conversion
  function encodePolishText(text) {
    // Convert Polish characters to their ASCII equivalents for reliable PDF rendering
    const polishChars = {
      'ą': 'a', 'Ą': 'A',
      'ć': 'c', 'Ć': 'C',
      'ę': 'e', 'Ę': 'E',
      'ł': 'l', 'Ł': 'L',
      'ń': 'n', 'Ń': 'N',
      'ó': 'o', 'Ó': 'O',
      'ś': 's', 'Ś': 'S',
      'ź': 'z', 'Ź': 'Z',
      'ż': 'z', 'Ż': 'Z'
    };
    
    // Replace all Polish characters with ASCII equivalents
    return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, match => polishChars[match] || match);
  }
  
  // Helper function to add text with proper formatting
  function addText(text, x, y, options = {}) {
    const {
      fontSize = 10,
      fontStyle = 'normal',
      align = 'left',
      color = [0, 0, 0],
      maxWidth = null,
      lineHeight: customLineHeight = lineHeight
    } = options;
    
    // Encode Polish characters for proper PDF rendering
    const encodedText = encodePolishText(text);
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...color);
    
    if (maxWidth) {
      const lines = doc.splitTextToSize(encodedText, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, x, y + (index * customLineHeight), { align });
      });
      return lines.length * customLineHeight;
    } else {
      doc.text(encodedText, x, y, { align });
      return customLineHeight;
    }
  }
  
  // Helper function to add a horizontal line
  function addHorizontalLine(y, color = [200, 200, 200]) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, rightMargin, y);
  }
  
  // Header - compact start
  yPosition = 20;
  
  // Calculation Details Section
  addText('SZCZEGÓŁY KALKULACJI', leftMargin, yPosition, {
    fontSize: 14,
    fontStyle: 'bold',
    color: primaryColor
  });
  yPosition += 10;
  
  // Basic information
  const businessFormDisplay = getBusinessFormDisplayName(currentCalculation.businessForm);
  
  // Helper function to get text width
  function getTextWidth(text, fontSize = 10, fontStyle = 'normal') {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    return doc.getTextWidth(encodePolishText(text));
  }
  
  // Rodzaj księgowości
  const typeLabel = 'Rodzaj księgowości: ';
  addText(typeLabel, leftMargin, yPosition, { fontStyle: 'bold' });
  const typeLabelWidth = getTextWidth(typeLabel, 10, 'bold');
  addText(currentCalculation.type, leftMargin + typeLabelWidth, yPosition);
  yPosition += lineHeight;
  
  // Forma działalności
  const formLabel = 'Forma działalności: ';
  addText(formLabel, leftMargin, yPosition, { fontStyle: 'bold' });
  const formLabelWidth = getTextWidth(formLabel, 10, 'bold');
  const formHeight = addText(businessFormDisplay, leftMargin + formLabelWidth, yPosition, { 
    maxWidth: rightMargin - leftMargin - formLabelWidth 
  });
  yPosition += Math.max(lineHeight, formHeight);
  
  // Liczba dokumentów
  const docsLabel = 'Liczba dokumentów: ';
  addText(docsLabel, leftMargin, yPosition, { fontStyle: 'bold' });
  const docsLabelWidth = getTextWidth(docsLabel, 10, 'bold');
  addText(currentCalculation.docs + ' miesięcznie', leftMargin + docsLabelWidth, yPosition);
  yPosition += lineHeight;
  
  if (currentCalculation.partnersCount > 1) {
    const partnersLabel = 'Liczba wspólników: ';
    addText(partnersLabel, leftMargin, yPosition, { fontStyle: 'bold' });
    const partnersLabelWidth = getTextWidth(partnersLabel, 10, 'bold');
    addText(currentCalculation.partnersCount.toString(), leftMargin + partnersLabelWidth, yPosition);
    yPosition += lineHeight;
  }
  
  yPosition += 10;
  
  // Services and Pricing Section
  addText('USŁUGI KSIĘGOWE', leftMargin, yPosition, {
    fontSize: 14,
    fontStyle: 'bold',
    color: primaryColor
  });
  yPosition += 10;
  
  // Base price
  addText('Cena podstawowa:', leftMargin, yPosition, { fontStyle: 'bold' });
  addText(currentCalculation.basePrice.toFixed(2) + ' zł', rightMargin - 30, yPosition, { align: 'right' });
  yPosition += lineHeight;
  
  // Additional procedures
  if (currentCalculation.extras.length > 0) {
    yPosition += 5;
    addText('Procedury szczególne:', leftMargin, yPosition, { 
      fontStyle: 'bold',
      color: accentColor
    });
    yPosition += lineHeight;
    
    currentCalculation.extras.forEach(extra => {
      const extraPrice = parseFloat(extra.price.replace(' zł', ''));
      addText('• ' + extra.name, leftMargin + 10, yPosition, { fontSize: 9 });
      addText(extra.price, rightMargin - 30, yPosition, { align: 'right', fontSize: 9 });
      yPosition += lineHeight;
      
      if (extra.details) {
        const detailHeight = addText(extra.details, leftMargin + 15, yPosition, { 
          fontSize: 8, 
          color: secondaryColor,
          maxWidth: rightMargin - leftMargin - 45,
          lineHeight: 6  // Smaller line height for details
        });
        yPosition += Math.max(6, detailHeight);
      }
    });
  }
  
  // Calculate accounting total
  const accountingTotal = currentCalculation.basePrice + (currentCalculation.extras.reduce((sum, extra) => {
    return sum + parseFloat(extra.price.replace(' zł', ''));
  }, 0));
  
  yPosition += 5;
  addHorizontalLine(yPosition, [150, 150, 150]);
  yPosition += 8;
  
  addText('Suma usług księgowych:', leftMargin, yPosition, { 
    fontStyle: 'bold',
    fontSize: 11
  });
  addText(accountingTotal.toFixed(2) + ' zł', rightMargin - 30, yPosition, { 
    align: 'right',
    fontStyle: 'bold',
    fontSize: 11
  });
  yPosition += 10;
  
  // Payroll Services Section (if applicable)
  if (currentCalculation.wantsPayroll && currentCalculation.payrollPrice > 0) {
    yPosition += 10; // Add top margin for separation
    
    addText('USŁUGI KADROWO-PŁACOWE', leftMargin, yPosition, {
      fontSize: 14,
      fontStyle: 'bold',
      color: primaryColor
    });
    yPosition += 10;
    
    // Payroll details
    if (currentCalculation.employeesCount > 0) {
      const regularEmployees = currentCalculation.employeesCount - currentCalculation.pfronEmployees;
      const pfronEmployees = currentCalculation.pfronEmployees;
      
      if (regularEmployees > 0) {
        addText(`Pracownicy (${regularEmployees} × 120 zł):`, leftMargin, yPosition);
        addText((regularEmployees * 120).toFixed(2) + ' zł', rightMargin - 30, yPosition, { align: 'right' });
        yPosition += lineHeight;
      }
      
      if (pfronEmployees > 0) {
        addText(`Pracownicy PFRON (${pfronEmployees} × 200 zł):`, leftMargin, yPosition);
        addText((pfronEmployees * 200).toFixed(2) + ' zł', rightMargin - 30, yPosition, { align: 'right' });
        yPosition += lineHeight;
      }
    }
    
    if (currentCalculation.contractorsCount > 0) {
      addText(`Zleceniobiorcy (${currentCalculation.contractorsCount} × 80 zł):`, leftMargin, yPosition);
      addText((currentCalculation.contractorsCount * 80).toFixed(2) + ' zł', rightMargin - 30, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }
    
    if (currentCalculation.boardCount > 0) {
      addText(`Członkowie zarządu (${currentCalculation.boardCount} × 80 zł):`, leftMargin, yPosition);
      addText((currentCalculation.boardCount * 80).toFixed(2) + ' zł', rightMargin - 30, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }
    
    yPosition += 5;
    addHorizontalLine(yPosition, [150, 150, 150]);
    yPosition += 8;
    
    addText('Suma usług kadrowo-płacowych:', leftMargin, yPosition, { 
      fontStyle: 'bold',
      fontSize: 11
    });
    addText(currentCalculation.payrollPrice.toFixed(2) + ' zł', rightMargin - 30, yPosition, { 
      align: 'right',
      fontStyle: 'bold',
      fontSize: 11
    });
    yPosition += 10;
  }
  
  // Final Total
  yPosition += 15; // More space before final total
  addHorizontalLine(yPosition, primaryColor);
  yPosition += 8;
  
  addText('CENA KOŃCOWA:', leftMargin, yPosition, {
    fontSize: 16,
    fontStyle: 'bold',
    color: primaryColor
  });
  addText(currentCalculation.finalPrice.toFixed(2) + ' zł', rightMargin - 30, yPosition, {
    align: 'right',
    fontSize: 16,
    fontStyle: 'bold',
    color: primaryColor
  });
  
  // Footer at bottom of page
  const footerY = 280; // Fixed position at bottom
  addHorizontalLine(footerY, [200, 200, 200]);
  
  const currentDate = new Date().toLocaleDateString('pl-PL');
  addText(`Wycena wygenerowana: ${currentDate}`, leftMargin, footerY + 5, {
    fontSize: 8,
    color: secondaryColor
  });
  
  // Generate filename (avoiding Polish characters in filename)
  const dateStr = new Date().toISOString().split('T')[0];
  let typeStr = currentCalculation.type;
  // Replace Polish characters for filename compatibility
  typeStr = typeStr.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, match => {
    const replacements = {
      'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
      'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    };
    return replacements[match] || match;
  });
  typeStr = typeStr.replace(/[^a-zA-Z0-9]/g, '');
  const filename = `wycena-${typeStr}-${dateStr}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}
