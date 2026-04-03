import ReactDOM from 'react-dom/client'

// Mock ReactDOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}))

// Mock App component
jest.mock('./components/App/App', () => {
  const MockApp = () => <div data-testid="mock-app">Mock App</div>
  MockApp.displayName = 'MockApp'
  return MockApp
})

describe('Application Entry Point', () => {
  it('renders without crashing', async () => {
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)

    // Dynamic import to trigger index.tsx execution
    await import('./index')

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(div)
    const mockCreateRoot = ReactDOM.createRoot as jest.Mock
    const mockRender = mockCreateRoot.mock.results[0].value.render

    expect(mockRender).toHaveBeenCalledWith(expect.anything())
  })
})
