import { itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import AnyPreviousConvictions, { PreviousConvictionsAnswers } from './anyPreviousConvictions'

describe('hasAnyPreviousConvictions', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new AnyPreviousConvictions({}, application)

      expect(page.title).toEqual('Previous unspent convictions for Roger Smith')
    })
  })

  describe('Questions', () => {
    const page = new AnyPreviousConvictions({}, application)

    describe('hasAnyPreviousConvictions', () => {
      it('has a question', () => {
        expect(page.questions.hasAnyPreviousConvictions.question).toBeDefined()
      })
    })
  })

  itShouldHavePreviousValue(new AnyPreviousConvictions({}, application), 'taskList')
  describe('next', () => {
    describe('when the applicant has previous unspent convictions with relevant risk', () => {
      describe('offence history', () => {
        describe('when no unspent convictions have been added yet', () => {
          it('takes the user to the offence history data page', () => {
            const page = new AnyPreviousConvictions(
              { hasAnyPreviousConvictions: PreviousConvictionsAnswers.YesRelevantRisk },
              application,
            )
            expect(page.next()).toEqual('unspent-convictions-data')
          })
        })

        describe('when some unspent convictions have been added', () => {
          it('takes the user to the unspent convictions page', () => {
            const applicationWithOffences = applicationFactory.build({
              person: personFactory.build({ name: 'Roger Smith' }),
              data: {
                'previous-unspent-convictions': { 'unspent-convictions-data': [{ convictionType: 'Stalking' }] },
              },
            })
            const page = new AnyPreviousConvictions(
              { hasAnyPreviousConvictions: PreviousConvictionsAnswers.YesRelevantRisk },
              applicationWithOffences,
            )
            expect(page.next()).toEqual('unspent-convictions')
          })
        })
      })
    })

    describe('when the applicant has previous unspent convictions with no relevant risk', () => {
      it('takes the user back to the task list', () => {
        const page = new AnyPreviousConvictions(
          { hasAnyPreviousConvictions: PreviousConvictionsAnswers.YesNoRelevantRisk },
          application,
        )
        expect(page.next()).toEqual('')
      })
    })
  })

  describe('errors', () => {
    describe('when they have not provided any answer', () => {
      it('returns an error', () => {
        const page = new AnyPreviousConvictions({}, application)
        expect(page.errors()).toEqual({
          hasAnyPreviousConvictions: 'Confirm whether the applicant has any previous unspent convictions',
        })
      })
    })

    describe('when the answer does not match the expected answers', () => {
      it('returns an error', () => {
        const page = new AnyPreviousConvictions(
          { hasAnyPreviousConvictions: 'yes' as PreviousConvictionsAnswers },
          application,
        )
        expect(page.errors()).toEqual({
          hasAnyPreviousConvictions: 'Confirm whether the applicant has any previous unspent convictions',
        })
      })
    })
  })
})
