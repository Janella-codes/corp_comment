// -- GLOBAL -- //
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');

// -- COUNTER COMPONENT -- //

const inputHandler = () => {
  // determine maximum number of characters

  const maxNrChars = 150;

  // determine number of characters currently in textarea
    const nrCharsTyped = textareaEl.value.length;

    // calculate number of characters left
    const charsLeft = maxNrChars - nrCharsTyped;

    // display number of characters left
    counterEl.textContent = charsLeft;
}

textareaEl.addEventListener('input', inputHandler);


// -- FORM COMPONENT -- //


const submitHandler = event => {
    // prevent default browser action (submitting form data to the 'action' URL and loading a new page)
    event.preventDefault();

    // get the value of the textarea
    const text = textareaEl.value;
    
    // validate text (e.g. check if #hashtag is present and text is long enough)
    if (text.includes('#') && text.length >= 10) {
        // show valid indicator
        formEl.classList.add('form--valid');
        // remove the visual indicator 
        setTimeout(() => {
            formEl.classList.remove('form--valid');
        }, 3000);
    } else {
        // show invalid indicator
        formEl.classList.add('form--invalid'); 
        // remove the visual indicator
        setTimeout(() => {
            formEl.classList.remove('form--invalid');
        }, 3000);

        //focus textarea
        textareaEl.focus();

        //stop this function execution
        return;
    }
    // we have text, now extract other info from the text
    const hashtag = text.split(' ').find(word => word.startsWith('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0,1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    // new feedback item HTML
    const feedbackItemHTML = `
            <li class="feedback">
        <button class="upvote">
            <i class="fa-solid fa-caret-up upvote__icon"></i>
            <span class="upvote__count">${upvoteCount}</span>
        </button>
        <section class="feedback__badge">
            <p class="feedback__letter">${badgeLetter}</p>
        </section>
        <div class="feedback__content">
            <p class="feedback__company">${company}</p>
            <p class="feedback__text">${text}</p>
        </div>
        <p class="feedback__date">${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
    </li>
    `;

    // insert new feedback item into the DOM
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);

    // clear the textarea
    textareaEl.value = '';

    // blur the submit button
    submitBtnEl.blur();

    // reset the counter 
    counterEl.textContent = 150;
    
};


formEl.addEventListener('submit', submitHandler);

