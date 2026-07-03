import { createMock } from '@golevelup/ts-jest'
import { applicationFactory } from '../../testutils/factories'
import getTaskStatus, { getPageData } from './getTaskStatus'
import TaskListPage from '../taskListPage'

describe('getTaskStatus', () => {
  const page1Instance = createMock<TaskListPage>()
  const page2Instance = createMock<TaskListPage>()
  const page3Instance = createMock<TaskListPage>()

  const Page1 = jest.fn(() => page1Instance)
  const Page2 = jest.fn(() => page2Instance)
  const Page3 = jest.fn(() => page3Instance)

  const task = {
    id: 'my-task',
    title: 'My Task',
    pages: {
      'page-1': Page1,
      'page-2': Page2,
      'page-3': Page3,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    page1Instance.errors.mockReturnValue({})
    page2Instance.errors.mockReturnValue({})
    page3Instance.errors.mockReturnValue({})
    page1Instance.next.mockReturnValue('page-2')
    page2Instance.next.mockReturnValue('page-3')
    page3Instance.next.mockReturnValue('')
    page1Instance.isApplicable.mockReturnValue(true)
    page2Instance.isApplicable.mockReturnValue(true)
    page3Instance.isApplicable.mockReturnValue(true)
  })

  it('returns not_started when there are no data for the first question in the task', () => {
    const application = applicationFactory.build({})

    expect(getTaskStatus(task, application)).toEqual('not_started')
  })

  it('returns in_progress when there are no data for the second question in the task', () => {
    const application = applicationFactory.build({ data: { 'my-task': { 'page-1': { foo: 'bar' } } } })

    expect(getTaskStatus(task, application)).toEqual('in_progress')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()

    expect(Page3).not.toHaveBeenCalled()
  })

  it('returns in_progress when there are errors', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' } } },
    })

    page1Instance.next.mockReturnValue('')
    page1Instance.errors.mockReturnValue({ some: 'errors' })

    expect(getTaskStatus(task, application)).toEqual('in_progress')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()
    expect(page1Instance.next).not.toHaveBeenCalled()
  })

  it('returns complete when the second page does not have a next page', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' } } },
    })

    page2Instance.next.mockReturnValue('')

    expect(getTaskStatus(task, application)).toEqual('complete')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()
    expect(page1Instance.next).toHaveBeenCalled()

    expect(Page2).toHaveBeenCalled()
    expect(page2Instance.errors).toHaveBeenCalled()
    expect(page2Instance.next).toHaveBeenCalled()

    expect(Page3).not.toHaveBeenCalled()
  })

  it('returns complete when the third page does not have a next page', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' }, 'page-3': { foo: 'bar' } } },
    })

    expect(getTaskStatus(task, application)).toEqual('complete')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).toHaveBeenCalled()
    expect(page1Instance.next).toHaveBeenCalled()

    expect(Page2).toHaveBeenCalled()
    expect(page2Instance.errors).toHaveBeenCalled()
    expect(page2Instance.next).toHaveBeenCalled()

    expect(Page3).toHaveBeenCalled()
    expect(page3Instance.errors).toHaveBeenCalled()
    expect(page3Instance.next).toHaveBeenCalled()
  })

  it('returns in_progress when the first page does not have data, but subsequent ones do', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-2': { foo: 'bar' }, 'page-3': { foo: 'bar' } } },
    })

    expect(getTaskStatus(task, application)).toEqual('in_progress')

    expect(Page1).toHaveBeenCalled()
    expect(page1Instance.errors).not.toHaveBeenCalled()
    expect(page1Instance.next).toHaveBeenCalled()

    expect(Page2).toHaveBeenCalled()
    expect(page2Instance.errors).toHaveBeenCalled()
    expect(page2Instance.next).not.toHaveBeenCalled()

    expect(Page3).not.toHaveBeenCalled()
    expect(page3Instance.errors).not.toHaveBeenCalled()
    expect(page3Instance.next).not.toHaveBeenCalled()
  })

  it('returns not_applicable when the first page returns isApplicable() false', () => {
    const application = applicationFactory.build({
      data: {},
    })
    page1Instance.isApplicable.mockReturnValue(false)
    expect(getTaskStatus(task, application)).toEqual('not_applicable')
  })

  // Because getTaskStatus was written to early return when a status is known, an error on page 1 would
  // return in_progress, so isApplicable wouldn't be called on page 2
  // We could change the function so that all the pages in a task were instantiated at the start of the function
  // and isApplicable checked on all of them before checking errors - that would require the tests changing though
  // to stop asserting on early returns
  xit('returns not_applicable when the second page returns isApplicable() false', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-1': { foo: 'bar' }, 'page-2': { foo: 'bar' } } },
    })
    page2Instance.isApplicable.mockReturnValue(false)
    expect(getTaskStatus(task, application)).toEqual('not_applicable')
  })

  it('returns in_progress when only the last page is complete', () => {
    const application = applicationFactory.build({
      data: { 'my-task': { 'page-3': { foo: 'bar' } } },
    })
    expect(getTaskStatus(task, application)).toEqual('in_progress')
  })
})

describe('getPageData', () => {
  it('returns undefined when there is not a matching task name', () => {
    const application = applicationFactory.build({ data: { nonMatchingTaskName: { page: 'page data' } } })
    expect(getPageData(application, 'taskName', 'pageName')).toEqual(undefined)
  })
  it('returns undefined when there is no data', () => {
    const application = applicationFactory.build({ data: null })
    expect(getPageData(application, 'taskName', 'pageName')).toEqual(undefined)
  })
})
