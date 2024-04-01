const getDOM = {
  textarea: () => document.querySelector('textarea'),
  validation: () => document.querySelector('.validation'),
  result: () => document.querySelector('.result'),
}

const randomElevenWords = () => {
  const result = []
  for (let i = 0; i < 11; i++) {
    const randomIndex = Math.floor(Math.random() * bipWords.length)
    result.push(bipWords[randomIndex])
  }
  return result
}

const resetValidation = () => {
  getDOM.validation().innerHTML = ''
  getDOM.validation().classList.add('display-none')
}

const onClickGenerate = async () => {
  const parsedUserInput = (getDOM.textarea().value || '').split(' ').filter(w => w)
  try {
    const result = await run(parsedUserInput)
    getDOM.result().querySelector('.list').textContent = result.join(' ')
    getDOM.result().querySelector('.title').textContent = `✅ ${result.length} available words for 12th word:`
    if (result.length === 0) getDOM.result().classList.add('display-none')
    else getDOM.result().classList.remove('display-none')
  } catch (e) {
    getDOM.validation().innerHTML = `❌ ${e}`
    getDOM.validation().classList.remove('display-none')
    getDOM.result().classList.add('display-none')
  }
}

const onInput = () => {
  resetValidation()
  onClickGenerate()
}

document.addEventListener('DOMContentLoaded', () => {
  getDOM.textarea().value = randomElevenWords().join(' ')
  onClickGenerate()
})