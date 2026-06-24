import BasePage from './basePage'

describe('basePage', () => {
  it('should default the previous and next methods', () => {
    const page = new BasePage()
    expect(page.next()).toEqual('')
    expect(page.previous()).toEqual('')
  })

  it('should generate a response from the questions', () => {
    const questions = {
      q1: {
        question: `label for question 1`,
        dataType: 'date',
      },
      q2: {
        question: `label for question 2`,
        dataType: 'radio',
        answers: { answer1: 'Answer 1', answer2: 'Answer 2' },
      },
      q3: {
        question: `Unanswered question will be omitted`,
        dataType: 'textArea',
      },
    }
    const body = {
      'q1-year': '2026',
      'q1-month': '6',
      'q1-day': '13',
      q2: 'answer2',
    }
    const page = new BasePage()
    page.questions = questions
    page.body = body
    expect(page.response()).toEqual({
      'label for question 1': '13 June 2026',
      'label for question 2': 'Answer 2',
    })
  })
})
