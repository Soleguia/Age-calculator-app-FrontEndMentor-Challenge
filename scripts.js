const $dayInput = document.querySelector('#input--day');
const $monthInput = document.querySelector('#input--month');
const $yearInput = document.querySelector('#input--year');
const $calculateBtn = document.querySelector('#action--calculate');
const $allInputWrappers = document.querySelector('.input-wrapper');

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

const errorMessages = {
    'input--day': {
        required: 'This field is required',
        valid: 'Must be a valid day'
    },
    'input--month': {
        required: 'This field is required',
        valid: 'Must be a valid month'
    },
    'input--year': {
        required: 'This field is required',
        valid: 'Must be in the past'
    }
}

const addLeadingZero = (e) => {
    const inputValue = e.currentTarget.value;

    if (inputValue && inputValue < 10 && inputValue.length < 2) {
        e.currentTarget.value = 0 + inputValue;
    }
}

const checkMaxLength = (e) => {
    const maxLength = e.currentTarget.getAttribute('maxlength');
    const inputValue = e.currentTarget.value;

    if (inputValue.length > maxLength) {
        e.currentTarget.value = e.currentTarget.value.slice(0, maxLength);
    }
}


$dayInput.addEventListener('input', (e) => {
    clearErrors(document.querySelector('.input-wrapper--day'));
    checkMaxLength(e);
});

$dayInput.addEventListener('focusout', (e) => {
    isValidDay();
    addLeadingZero(e);
});

$monthInput.addEventListener('input', (e) => {
    clearErrors(document.querySelector('.input-wrapper--month'));
    checkMaxLength(e);
    updateMaxDays();
});

$monthInput.addEventListener('focusout', (e) => {
    isValidMonth();
    addLeadingZero(e);
});

$yearInput.addEventListener('input', (e) => {
    clearErrors(document.querySelector('.input-wrapper--year'));
    checkMaxLength(e);
    updateMaxDays();
});

$yearInput.addEventListener('focusout', (e) => {
    isValidYear();
});

const updateMaxDays = () => {
    const year = $yearInput.value || currentYear;
    const month =  $monthInput.value || currentMonth;
    const maxMonthDays = new Date(year, month, 0).getDate();
    $dayInput.setAttribute('max', maxMonthDays);
}


// Validation

const clearErrors = ($selector = $allInputWrappers) => {
    $selector.classList.remove('error', 'error--empty');
}

const validateEmptyField = ($field) => $field.value === '';


const isValidDay = () => {
    const $wrapper = $dayInput.closest('.input-wrapper');
    clearErrors($wrapper);

    if(validateEmptyField($dayInput)) {
        setError($wrapper, errorMessages[$dayInput.id].required)
    } else if (isInsideMinMax($dayInput)) {
        setError($wrapper, errorMessages[$dayInput.id].valid)
    } else {
        return true;
    }
    return false;
}

const isValidMonth = () => {
    const $wrapper = $monthInput.closest('.input-wrapper');
    clearErrors($wrapper);

    if(validateEmptyField($monthInput)) {
        setError($wrapper, errorMessages[$monthInput.id].required)
    } else if (isInsideMinMax($dayInput)) {
        setError($wrapper, errorMessages[$monthInput.id].valid)
    } else {
        return true;
    }
    return false;
}

const isInsideMinMax = ($input) => {
    const min = $input.getAttribute('min');
    const max = $input.getAttribute('max');
    return (Number($input.value) < min || Number($input.value) > max);
}

const isValidYear = () => {
    const $wrapper = $yearInput.closest('.input-wrapper');
    clearErrors($wrapper);

    if (validateEmptyField($yearInput)) {
        setError($wrapper, errorMessages[$yearInput.id].required)
    } else if ($yearInput.value > currentYear) {
        setError($wrapper, errorMessages[$yearInput.id].valid);
    } else {
        return true;
    }
    return false;
}

const setError = ($selector, errorMessage) => {
    $selector.classList.add('error', 'error--empty');
    $selector.querySelector('.input__error').innerHTML = errorMessage;
}

// Calculate result

$calculateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const validDay = isValidDay();
    const validMonth = isValidMonth();
    const validYear = isValidYear();

    if (validDay && validMonth && validYear) {
        calculateResults();
    }

});

const calculateResults = () => {
    const $resultYears = document.querySelector('.result--years .result__amount');
    const $resultMonths = document.querySelector('.result--months .result__amount');
    const $resultDays = document.querySelector('.result--days .result__amount');
    
    const milliseconds = currentDate.getTime() - new Date($yearInput.value, ($monthInput.value-1), $dayInput.value).getTime();
    
    const days = Math.round(milliseconds / (24 * 60 * 60 * 1000));
    
    const resultYears = Math.floor(days / 365);
    $resultYears.innerHTML = resultYears;

    const monthdiff = (currentMonth+1) - $monthInput.value;
    const resultMonths = monthdiff >= 0 ? monthdiff : 12 + monthdiff;
    $resultMonths.innerHTML = resultMonths;

    const daysdiff = currentDay - Number($dayInput.value);
    const resultDays = daysdiff < 0 ? new Date(currentYear, currentMonth, 0).getDate() - Number($dayInput.value) + currentDay : daysdiff;
    $resultDays.innerHTML = resultDays;

}