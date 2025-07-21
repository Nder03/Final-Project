import { render, screen } from '@testing-library/react';
import AdminPage from '../pages/admin/index';
import { useAuth } from '@/AuthContext';

jest.mock('@/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('AdminPage', () => {
  it('shows "Access Denied" for a non-admin user', () => {
    useAuth.mockReturnValue({
      currentUser: {
        uid: 'SOME_RANDOM_USER_ID', 
      },
    });

    render(<AdminPage />);

    const accessDeniedMessage = screen.getByText(/Access Denied/i);

    expect(accessDeniedMessage).toBeInTheDocument();
  });

  it('shows the dashboard for the admin user', () => {
    useAuth.mockReturnValue({
      currentUser: {
        uid: 'DIWd0JUi10hjngGiUYhaDHCSKvu1', 
      },
    });

    render(<AdminPage />);
   
    const dashboardTitle = screen.getByRole('heading', { name: /Admin Dashboard/i });

    expect(dashboardTitle).toBeInTheDocument();
  });
});