// -- GLOBAL -- //
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags');



const renderFeedbackItem = feedbackItem => {

        // new feedback item HTML
        const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${feedbackItem.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedbackItem.company}</p>
                <p class="feedback__text">${feedbackItem.text}</p>
            </div>
                <p class="feedback__date">${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
        </li>
    `;

    // insert new feedback item into the DOM
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
};

// -- COUNTER COMPONENT -- //

(() => {
    const inputHandler = () => {
        // determine maximum number of characters
      
        const maxNrChars = MAX_CHARS;
      
        // determine number of characters currently in textarea
          const nrCharsTyped = textareaEl.value.length;
      
          // calculate number of characters left
          const charsLeft = maxNrChars - nrCharsTyped;
      
          // display number of characters left
          counterEl.textContent = charsLeft;
      }
      
      textareaEl.addEventListener('input', inputHandler);

})(); 



// -- FORM COMPONENT -- //

(() => {

    const showVisualIndicator = textCheck => {
        const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
    
        // show valid indicator
        formEl.classList.add(className);
    
        // remove visaual indicator
        setTimeout(() => {
            formEl.classList.remove(className);
        }, 3000);
    };
    
    const submitHandler = event => {
        // prevent default browser action (submitting form data to the 'action' URL and loading a new page)
        event.preventDefault();
    
        // get the value of the textarea
        const text = textareaEl.value;
        
        // validate text (e.g. check if #hashtag is present and text is long enough)
        if (text.includes('#') && text.length >= 10) {
           showVisualIndicator('valid');
        } else {
            showVisualIndicator('invalid');
         
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
    
        // render feedback item in list
        const feedbackItem = {
            upvoteCount: upvoteCount,
            company: company,
            badgeLetter: badgeLetter,
            daysAgo: daysAgo,
            text: text,
            hashtag: hashtag,
        };
        renderFeedbackItem(feedbackItem);
    
        // send feedback item to server
        fetch(`${BASE_API_URL}/feedbacks`, {
            method: 'POST',
            body: JSON.stringify(feedbackItem),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
                if (!res.ok) {
                   return;
                }
                console.log('Feedback saved successfully');
            }).catch(err => console.log(err));
    
        // clear the textarea
        textareaEl.value = '';
    
        // blur the submit button
        submitBtnEl.blur();
    
        // reset the counter 
        counterEl.textContent = MAX_CHARS;
    };
    
    formEl.addEventListener('submit', submitHandler);

})();




    // -- FEEDBACK LIST COMPONENT -- //
    (() => {
    const clickHandler = event => {
        // get clicked HTML element
        const clickedEl = event.target;
  
        // determine if user intended to upvote or expand
       const upvoteIntention = clickedEl.classList.contains('upvote');

       // run the appropriate Logic 
       if (upvoteIntention) {
        // get the closest upvote button 
        const upvoteBtnEl = clickedEl.closest('.upvote');

        // disable upvote button (prevent double-clicking, spam
        upvoteBtnEl.disabled = true;

        // select the upvote count element within the upvote button
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');

        // get the current upvote count as a number (+)
        let upvoteCount = +upvoteCountEl.textContent;


        // set upvote count increased by 1
        upvoteCountEl.textContent = ++upvoteCount;

       } else {
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
       }
    };


feedbackListEl.addEventListener('click', clickHandler);

fetch(`${BASE_API_URL}/feedbacks`)
    .then(res => res.json())
    .then(data => {
        // remove spinner
        spinnerEl.remove();

        // iterate over each element in feedbacks array and render it in list
        data.feedbacks.forEach(feedbackItem => renderFeedbackItem(feedbackItem));
    })
    .catch(err => {
        feedbackListEl.textContent = `Error loading feedbacks ${err.message}`;
    });
})();

        
// -- HASHTAG COMPONENT -- //

(() => {
const clickHandler = event => {
    // get clicked HTML element
    const clickedEl = event.target;

    // stop function if click happened in the list, but outside buttons 
    if (clickedEl.className === 'hashtags') return;

    // extract company name from hashtag
    const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();

    // iterate over each feedback item in the list
    feedbackListEl.childNodes.forEach(childNode => {
        // stop this iteration if it's a text node
        if (childNode.nodeType === 3) return;

        // get company name 
        const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

        // remove feedback item from list if company names are not equal
        if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
            childNode.remove();
        }
    });
};


hashtagListEl.addEventListener('click', clickHandler);

})();



