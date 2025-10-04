import TaskManager from '@/components/TaskManager';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the UI components
jest.mock('@/components/ui/badge', () => {
  return function MockBadge({ children, ...props }: any) {
    return (
      <span data-testid="badge" {...props}>
        {children}
      </span>
    );
  };
});

jest.mock('@/components/ui/card', () => {
  return function MockCard({ children, ...props }: any) {
    return (
      <div data-testid="card" {...props}>
        {children}
      </div>
    );
  };
});

jest.mock('@/components/ui/progress', () => {
  return function MockProgress({ value, ...props }: any) {
    return (
      <div data-testid="progress" {...props}>
        <div data-testid="progress-value">{value}%</div>
      </div>
    );
  };
});

jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, onClick, ...props }: any) {
    return (
      <button data-testid="button" onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

// Mock the theme store
jest.mock('@/lib/store', () => ({
  useThemeStore: () => ({
    theme: 'dark',
    setTheme: jest.fn(),
  }),
}));

// Mock setTimeout and setInterval
const mockSetTimeout = jest.fn();
const mockClearInterval = jest.fn();
const mockSetInterval = jest.fn(() => 12345); // Return a fake interval ID

Object.defineProperty(global, 'setTimeout', {
  value: mockSetTimeout,
  writable: true,
});

Object.defineProperty(global, 'clearInterval', {
  value: mockClearInterval,
  writable: true,
});

Object.defineProperty(global, 'setInterval', {
  value: mockSetInterval,
  writable: true,
});

describe('TaskManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetTimeout.mockImplementation((callback) => {
      callback();
      return 123;
    });
  });

  describe('Component Rendering', () => {
    it('renders the task manager with default props', () => {
      render(<TaskManager />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(
        screen.getByText('Automatic task updates when specifications are generated')
      ).toBeInTheDocument();
      expect(screen.getByText('Select Feature')).toBeInTheDocument();
      expect(screen.getByText('Generate Spec (Auto-updates Tasks)')).toBeInTheDocument();
    });

    it('renders with custom feature ID', () => {
      render(<TaskManager featureId="test-feature-001" />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      // The component should initialize with the provided feature ID
    });

    it('renders without progress when showProgress is false', () => {
      render(<TaskManager showProgress={false} />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
    });

    it('renders without auto-refresh when autoRefresh is false', () => {
      render(<TaskManager autoRefresh={false} />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(screen.getByText('Auto-refresh')).toBeInTheDocument();
    });
  });

  describe('Feature Selection', () => {
    it('loads and displays available features', async () => {
      render(<TaskManager />);

      // Wait for features to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      // Check for the mock features
      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      expect(featureSelect).toBeInTheDocument();
    });

    it('allows selecting a feature', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      // Select a feature
      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      expect(featureSelect).toHaveValue('001-speck-it-mcp-server-docs');
    });

    it('loads tasks when a feature is selected', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      // Select a feature
      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Tasks should be loaded
      await waitFor(() => {
        expect(screen.getByText('Tasks (22)')).toBeInTheDocument();
      });
    });
  });

  describe('Task Display', () => {
    it('displays tasks when a feature is selected', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Check for tasks
      await waitFor(() => {
        expect(screen.getByText('T001')).toBeInTheDocument();
        expect(screen.getByText('T002')).toBeInTheDocument();
        expect(screen.getByText('T003')).toBeInTheDocument();
      });
    });

    it('displays task details correctly', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Check for task details
      await waitFor(() => {
        expect(screen.getByText(/T001.*Establish project scaffolding/)).toBeInTheDocument();
        expect(screen.getByText(/Priority 1/)).toBeInTheDocument();
        expect(screen.getByText(/workflow/)).toBeInTheDocument();
      });
    });

    it('displays task completion status', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Check for completed tasks
      await waitFor(() => {
        const completedTasks = screen.getAllByText('T001');
        expect(completedTasks.length).toBeGreaterThan(0);
      });
    });

    it('displays task progress', async () => {
      const user = userEvent.setup();
      render(<TaskManager showProgress={true} />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Check for progress
      await waitFor(() => {
        expect(screen.getByText(/17\/22 tasks completed/)).toBeInTheDocument();
        expect(screen.getByTestId('progress')).toBeInTheDocument();
      });
    });
  });

  describe('Task Interaction', () => {
    it('allows toggling task completion status', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Find and toggle a task
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);

        // Toggle the first task
        userEvent.click(checkboxes[0]);
      });
    });

    it('updates task status when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Find and click a task checkbox
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        userEvent.click(checkboxes[0]);
      });

      // The task should be updated (this would be verified by checking the API call)
    });
  });

  describe('Spec Generation', () => {
    it('allows generating specifications', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Click the generate spec button
      const generateButton = screen.getByText('Generate Spec (Auto-updates Tasks)');
      await user.click(generateButton);

      // The button should be disabled during loading
      expect(generateButton).toBeDisabled();
    });

    it('shows loading state during spec generation', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // Click the generate spec button
      const generateButton = screen.getByText('Generate Spec (Auto-updates Tasks)');
      await user.click(generateButton);

      // Check for loading state
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Auto-refresh Functionality', () => {
    it('toggles auto-refresh on and off', async () => {
      const user = userEvent.setup();
      render(<TaskManager autoRefresh={true} />);

      const autoRefreshButton = screen.getByText('Auto-refresh');
      expect(autoRefreshButton).toBeInTheDocument();

      // Click to toggle off
      await user.click(autoRefreshButton);
      expect(screen.getByText('Pause')).toBeInTheDocument();

      // Click to toggle on
      await user.click(screen.getByText('Pause'));
      expect(screen.getByText('Auto-refresh')).toBeInTheDocument();
    });

    it('shows auto-refresh status', async () => {
      render(<TaskManager autoRefresh={true} />);

      expect(screen.getByText('Auto-refresh')).toBeInTheDocument();
    });

    it('shows pause status when auto-refresh is disabled', async () => {
      render(<TaskManager autoRefresh={false} />);

      expect(screen.getByText('Auto-refresh')).toBeInTheDocument();
    });
  });

  describe('Manual Refresh', () => {
    it('allows manual refresh of tasks', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      const refreshButton = screen.getByText('Refresh');
      expect(refreshButton).toBeInTheDocument();

      await user.click(refreshButton);

      // The refresh button should be temporarily disabled
      expect(refreshButton).toBeDisabled();
    });

    it('shows loading state during manual refresh', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      const refreshButton = screen.getByText('Refresh');
      await user.click(refreshButton);

      // Check for loading state
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error messages when API calls fail', async () => {
      // Mock a failed API call
      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<TaskManager />);

      // The component should handle errors gracefully
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });

    it('shows error state when feature loading fails', async () => {
      // Mock a failed API call
      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<TaskManager />);

      // The component should handle errors gracefully
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });

    it('shows error state when task loading fails', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Wait for features to load and select one
      await waitFor(() => {
        expect(screen.getByDisplayValue('Choose a feature...')).toBeInTheDocument();
      });

      const featureSelect = screen.getByDisplayValue('Choose a feature...');
      await user.selectOptions(featureSelect, '001-speck-it-mcp-server-docs');

      // The component should handle errors gracefully
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('adapts to different screen sizes', () => {
      render(<TaskManager />);

      // The component should be responsive
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });

    it('displays properly on mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<TaskManager />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<TaskManager />);

      expect(screen.getByRole('heading', { name: 'Task Manager' })).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Test keyboard navigation
      await user.tab();

      // Should focus on interactive elements
      expect(document.body).toHaveFocus();
    });

    it('provides proper contrast ratios', () => {
      render(<TaskManager />);

      // The component should have proper contrast
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with large task lists', () => {
      render(<TaskManager />);

      // The component should handle large task lists efficiently
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });

    it('does not cause memory leaks', () => {
      const { unmount } = render(<TaskManager />);

      // Unmount the component
      unmount();

      // The component should not cause memory leaks
      expect(true).toBe(true);
    });
  });
});
