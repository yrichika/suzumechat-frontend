import { render, screen } from '@testing-library/react'
import NextPage from '../pages/index'
import '@testing-library/jest-dom'

// mocking useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

describe('Home', () => {
  it('renders a heading', () => {
    render(<NextPage />)

    // const heading = screen.getByRole('heading', {
    //   name: /welcome to next\.js!/i,
    // });

    // expect(heading).toBeInTheDocument();
  })
})
