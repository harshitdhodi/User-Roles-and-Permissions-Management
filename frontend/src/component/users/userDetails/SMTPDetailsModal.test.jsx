// SMTPDetailsModal.test.jsx

import { render, waitFor } from '@testing-library/react';
import SMTPDetailsModal from './SMTPDetailsModal';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SMTP_DETAILS_BY_USER_ID } from '@/store/api/smtp.api';

const mockSmtpData = {
    host: 'example.com',
    port: '587',
    username: 'testuser',
    password: 'testpassword',
    encryption: 'TLS'
};

const mocks = [
    {
        request: {
            query: GET_SMTP_DETAILS_BY_USER_ID,
            variables: { userId: '123' },
        },
        result: {
            data: {
                smtpDetails: mockSmtpData,
            },
        },
    },
];

test('renders the modal with initial SMTP details when opened', async () => {
    const { getByText } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <SMTPDetailsModal isOpen={true} onClose={() => {}} userId="123" />
        </MockedProvider>
    );

    await waitFor(() => {
        expect(getByText('SMTP Details for 123')).toBeInTheDocument();
        expect(getByText('example.com')).toBeInTheDocument();
        expect(getByText('587')).toBeInTheDocument();
        expect(getByText('testuser')).toBeInTheDocument();
        expect(getByText('********')).toBeInTheDocument();
        expect(getByText('TLS')).toBeInTheDocument();
    });
});import { render, waitFor } from '@testing-library/react';
import SMTPDetailsModal from './SMTPDetailsModal';
import { mockUseGetSmtpDetailsByUserIdQuery } from './SMTPDetailsModal.mocks';

jest.mock('@/store/api/smtp.api', () => ({
  ...jest.requireActual('@/store/api/smtp.api'),
  useGetSmtpDetailsByUserIdQuery: jest.fn(),
}));

describe('SMTPDetailsModal', () => {
  beforeEach(() => {
    mockUseGetSmtpDetailsByUserIdQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });
  });

  it('should display loading state while fetching SMTP details', async () => {
    const { getByText } = render(<SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId="123" />);

    expect(getByText('..loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText('..loading')).not.toBeInTheDocument();
    });
  });
});import { renderHook } from '@testing-library/react-hooks';
import { useGetSmtpDetailsByUserIdQuery } from '@/store/api/smtp.api';
import SMTPDetailsModal from './SMTPDetailsModal';

jest.mock('@/store/api/smtp.api');

test('Should handle error when fetching SMTP details fails', async () => {
  // Mock the useGetSmtpDetailsByUserIdQuery hook to return an error
  useGetSmtpDetailsByUserIdQuery.mockReturnValue({
    data: null,
    loading: false,
    error: new Error('Failed to fetch SMTP details'),
  });

  // Render the SMTPDetailsModal component
  const { result, waitForNextUpdate } = renderHook(() => ({
    isOpen: true,
    onClose: jest.fn(),
    userId: '123',
  }), ({ isOpen, onClose, userId }) => (
    <SMTPDetailsModal isOpen={isOpen} onClose={onClose} userId={userId} />
  ));

  // Wait for the error to be handled
  await waitForNextUpdate();

  // Assert that the error is displayed in the modal
  expect(result.current.error).toBe('Failed to fetch SMTP details');
});// SMTPDetailsModal.test.jsx

import { render, screen } from '@testing-library/react';
import SMTPDetailsModal from './SMTPDetailsModal';

test('Should mask password field when not in edit mode', () => {
  const userId = 'testUser';
  const smtpData = {
    host: 'example.com',
    port: '587',
    username: 'testUser',
    password: 'testPassword',
    encryption: 'TLS',
  };

  render(
    <SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId={userId} />
  );

  // Simulate loading state
  render(
    <SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId={userId} />
  );
  expect(screen.getByText('..loaidng')).toBeInTheDocument();

  // Simulate loaded state
  render(
    <SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId={userId} />
  );
  const passwordField = screen.getByLabelText('Password');
  expect(passwordField).toHaveDisplayValue('********');
});// SMTPDetailsModal.test.jsx

import { render, fireEvent } from '@testing-library/react';
import SMTPDetailsModal from './SMTPDetailsModal';

// Mock the necessary components and hooks
jest.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children }) => <div>{children}</div>,
    DialogContent: ({ children }) => <div>{children}</div>,
    DialogHeader: ({ children }) => <div>{children}</div>,
    DialogTitle: ({ children }) => <div>{children}</div>,
    DialogDescription: ({ children }) => <div>{children}</div>,
    DialogFooter: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
    Button: ({ children, ...rest }) => <button {...rest}>{children}</button>,
}));

jest.mock('@/components/ui/input', () => ({
    Input: ({ ...rest }) => <input {...rest} />,
}));

jest.mock('lucide-react', () => ({
    Copy: () => <svg />,
    Edit: () => <svg />,
    Save: () => <svg />,
    X: () => <svg />,
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/store/api/smtp.api', () => ({
    useCreateSmtpDetailsMutation: () => jest.fn(() => [{ createSmpt: jest.fn() }]),
    useGetSmtpDetailsByIdQuery: () => jest.fn(() => ({ data: { host: 'testHost', port: 'testPort', username: 'testUser', password: 'testPassword', encryption: 'testEncryption' }, loading: false, error: null })),
    useGetSmtpDetailsByUserIdQuery: () => jest.fn(() => ({ data: { host: 'testHost', port: 'testPort', username: 'testUser', password: 'testPassword', encryption: 'testEncryption' }, loading: false, error: null })),
}));

// Test case: Should copy password to clipboard when the copy button is clicked
test('copies password to clipboard when the copy button is clicked', async () => {
    const mockClipboardWriteText = jest.fn();
    global.navigator.clipboard = {
        writeText: mockClipboardWriteText,
    };

    const { getByText } = render(<SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId="testUser" />);
    const copyButton = getByText('Copy');

    fireEvent.click(copyButton);

    expect(mockClipboardWriteText).toHaveBeenCalledWith('testPassword');
});import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import SMTPDetailsModal from './SMTPDetailsModal';
import { useCreateSmtpDetailsMutation } from '@/store/api/smtp.api';

jest.mock('@/store/api/smtp.api', () => ({
  useCreateSmtpDetailsMutation: jest.fn(() => [
    jest.fn().mockRejectedValue(new Error('Failed to update SMTP details')),
    { isLoading: false, isError: true },
  ]),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

test('Should display an error message when updating SMTP details fails', async () => {
  const { getByText } = render(<SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId="user1" />);

  // Open edit mode
  userEvent.click(getByText('Edit'));

  // Fill form and submit
  userEvent.type(getByText('Host'), 'example.com');
  userEvent.type(getByText('Port'), '587');
  userEvent.type(getByText('Username'), 'testuser');
  userEvent.type(getByText('Encryption'), 'TLS');
  userEvent.type(getByText('Password'), 'password123');
  userEvent.click(getByText('Save'));

  // Wait for error toast
  await waitFor(() => expect(toast.error).toBeCalledWith('Failed to update SMTP details'));
});import { render, fireEvent, waitFor } from '@testing-library/react';
import SMTPDetailsModal from './SMTPDetailsModal';
import { useCreateSmtpDetailsMutation, useGetSmtpDetailsByUserIdQuery } from '@/store/api/smtp.api';
import { toast } from 'react-toastify';

jest.mock('@/store/api/smtp.api', () => ({
  useCreateSmtpDetailsMutation: jest.fn(),
  useGetSmtpDetailsByUserIdQuery: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockCreateSmtpDetailsMutation = useCreateSmtpDetailsMutation.mockReturnValue([
  jest.fn(),
  { isLoading: false, isSuccess: false, isError: false },
]);

const mockGetSmtpDetailsByUserIdQuery = useGetSmtpDetailsByUserIdQuery.mockReturnValue({
  data: {
    host: 'example.com',
    port: 587,
    username: 'testuser',
    password: 'testpassword',
    encryption: 'TLS',
  },
  isLoading: false,
  isError: false,
});

describe('SMTPDetailsModal', () => {
  it('should update SMTP details when the save button is clicked', async () => {
    const userId = '123';
    const { getByText, getByLabelText } = render(
      <SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId={userId} />
    );

    const hostInput = getByLabelText('Host');
    const portInput = getByLabelText('Port');
    const usernameInput = getByLabelText('Username');
    const encryptionInput = getByLabelText('Encryption');
    const passwordInput = getByLabelText('Password');
    const saveButton = getByText('Save');

    fireEvent.change(hostInput, { target: { value: 'new.example.com' } });
    fireEvent.change(portInput, { target: { value: 465 } });
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(encryptionInput, { target: { value: 'SSL' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateSmtpDetailsMutation[0]).toHaveBeenCalledWith({
        host: 'new.example.com',
        port: 465,
        username: 'newuser',
        password: 'newpassword',
        encryption: 'SSL',
      });
      expect(toast.success).toHaveBeenCalledWith('SMTP details updated successfully');
    });
  });
});import { render, fireEvent } from "@testing-library/react";
import SMTPDetailsModal from "./SMTPDetailsModal";

// Mocking necessary functions and data
jest.mock("@/store/api/smtp.api", () => ({
  useCreateSmtpDetailsMutation: () => jest.fn(),
  useGetSmtpDetailsByIdQuery: () => ({
    data: {
      host: "example.com",
      port: "587",
      username: "testuser",
      password: "testpassword",
      encryption: "TLS",
    },
    loading: false,
    error: null,
  }),
  useGetSmtpDetailsByUserIdQuery: () => ({
    data: {
      host: "example.com",
      port: "587",
      username: "testuser",
      password: "testpassword",
      encryption: "TLS",
    },
    loading: false,
    error: null,
  }),
}));

describe("SMTPDetailsModal", () => {
  it("should disable edit mode when the cancel button is clicked", () => {
    const { getByText } = render(
      <SMTPDetailsModal isOpen={true} onClose={jest.fn()} userId="123" />
    );

    // Open edit mode
    fireEvent.click(getByText("Edit"));

    // Expect edit mode to be enabled
    expect(getByText("Cancel")).toBeInTheDocument();

    // Click cancel button to disable edit mode
    fireEvent.click(getByText("Cancel"));

    // Expect edit mode to be disabled
    expect(getByText("Edit")).toBeInTheDocument();
  });
});// SMTPDetailsModal.test.js

import { render, fireEvent, waitFor } from '@testing-library/react';
import SMTPDetailsModal from './SMTPDetailsModal';
import { MockedProvider } from '@apollo/client/testing';
import { GET_SMTP_DETAILS_BY_USER_ID, CREATE_SMTP_DETAILS } from '@/store/api/smtp.api';


test('validates form inputs when saving', async () => {
    const { getByLabelText, getByText } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <SMTPDetailsModal isOpen={true} onClose={() => {}} userId="123" />
        </MockedProvider>
    );

    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByLabelText('Port'), { target: { value: 'invalid' } });
    fireEvent.change(getByLabelText('Encryption'), { target: { value: 'invalid' } });

    fireEvent.click(getByText('Save'));

    await waitFor(() => {
        expect(getByText('Invalid port number')).toBeInTheDocument();
        expect(getByText('Invalid encryption type')).toBeInTheDocument();
    });
});