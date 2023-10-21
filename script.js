const formEl = document.getElementById('date-form');
const [dayError, monthError, yearError] = formEl.querySelectorAll('.error');
const resultEl = document.getElementById('result');
const [yearResult, monthResult, dayResult] = resultEl.querySelectorAll(
  'div > span:first-child'
);
const today = new Date();
let intervalIds = [null, null, null];

formEl.year.setAttribute('max', today.getFullYear());

formEl.day.addEventListener('input', validateForm);
formEl.month.addEventListener('input', validateForm);
formEl.year.addEventListener('input', validateForm);

formEl.day.addEventListener('change', addLeadingZeroes);
formEl.month.addEventListener('change', addLeadingZeroes);
formEl.year.addEventListener('change', addLeadingZeroes);

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  validateForm();

  if (dayError.textContent || monthError.textContent || yearError.textContent) {
    return;
  }

  // Stop previous animations
  intervalIds.forEach(clearInterval);

  const day = +e.target.day.value;
  const month = +e.target.month.value - 1;
  const year = +e.target.year.value;

  const inputDate = new Date(year, month, day);
  const resultDate = new Date(today);

  resultDate.setFullYear(today.getFullYear() - inputDate.getFullYear());
  resultDate.setMonth(today.getMonth() - inputDate.getMonth());
  resultDate.setDate(today.getDate() - inputDate.getDate());

  intervalIds[0] = animateValue(dayResult, resultDate.getDate());
  intervalIds[1] = animateValue(monthResult, resultDate.getMonth());
  intervalIds[2] = animateValue(yearResult, resultDate.getFullYear());
});

function validateForm() {
  // Validate day
  if (formEl.day.validity.valid) {
    dayError.textContent = '';
    formEl.day.classList.remove('invalid');
  } else {
    if (formEl.day.validity.valueMissing) {
      dayError.textContent = 'This field is required';
    } else if (
      formEl.day.validity.rangeOverflow ||
      formEl.day.validity.rangeUnderflow
    ) {
      dayError.textContent = 'Must be a valid day';
    }
  }

  // Valiate month
  if (formEl.month.validity.valid) {
    monthError.textContent = '';
    formEl.month.classList.remove('invalid');
  } else {
    if (formEl.month.validity.valueMissing) {
      monthError.textContent = 'This field is required';
    } else if (
      formEl.month.validity.rangeOverflow ||
      formEl.month.validity.rangeUnderflow
    ) {
      monthError.textContent = 'Must be a valid month';
    }
  }

  // Validate year
  if (formEl.year.validity.valid) {
    yearError.textContent = '';
    formEl.year.classList.remove('invalid');
  } else {
    if (formEl.year.validity.valueMissing) {
      yearError.textContent = 'This field is required';
    } else if (formEl.year.validity.rangeUnderflow) {
      yearError.textContent = 'Must be 100 or greater';
    } else if (formEl.year.validity.rangeOverflow) {
      yearError.textContent = 'Must be in the past';
    }
  }

  // Check if date is valid (e.g. April 31th is invalid)
  if (
    formEl.day.validity.valid &&
    formEl.month.validity.valid &&
    formEl.year.validity.valid
  ) {
    const day = +formEl.day.value;
    const month = +formEl.month.value - 1;
    const year = +formEl.year.value;

    const inputDate = new Date(year, month, day);

    if (
      day !== inputDate.getDate() ||
      month !== inputDate.getMonth() ||
      year !== inputDate.getFullYear()
    ) {
      formEl.day.classList.add('invalid');
      formEl.month.classList.add('invalid');
      formEl.year.classList.add('invalid');
      dayError.textContent = 'Must be a valid date';
    }
  }
}

function addLeadingZeroes({ target }) {
  target.value = target.value
    ? `${+target.value}`.padStart(+target.getAttribute('maxlength'), '0')
    : '';
}

function animateValue(el, value) {
  let i = +el.textContent || 0;
  let step = i < value ? 1 : -1;

  let intervalId = setInterval(() => {
    el.textContent = i;

    if (i === value) {
      clearInterval(intervalId);
    }

    i += step;
  }, 25);

  return intervalId;
}
