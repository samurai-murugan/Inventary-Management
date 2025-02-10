export interface ErrorListType {
  id: string;
  name: string;
  message: string;
  children: { id: string; name: string; message: string }[];
}

export const ErrorList: ErrorListType[] = [
  {
    id: '1',
    name: 'LOGIN_PAGE',
    message: 'For handling login page error',
    children: [
      {
        id: '1.1',
        name: 'email_id_is_empty',
        message: 'Email is required',
      },
      {
        id: '1.2',
        name: 'email_id_is_invalid',
        message: 'Invalid email',
      },
      {
        id: '1.3',
        name: 'password_is_empty',
        message: 'Password is required',
      },
    ],
  },
  {
    id: '2',
    name: 'REGISTER_PAGE',
    message: 'For handling Register page error',
    children: [
      {
        id: '2.1',
        name: 'firstname_is_empty',
        message: 'Firstname is required',
      },
      {
        id: '2.9',
        name: 'lastname_is_empty',
        message: 'Lastname is required',
      },
      {
        id: '2.2',
        name: 'email_id_is_empty',
        message: 'Email is required',
      },
      {
        id: '2.3',
        name: 'email_id_is_invalid',
        message: 'Invalid email',
      },
      {
        id: '2.4',
        name: 'password_is_empty',
        message: 'Password is required',
      },
      {
        id: '2.5',
        name: 'password_is_Weak',
        message: 'Password is Weak',
      },
      {
        id: '2.6',
        name: 'password_is_Invalid',
        message: 'Password is Invalid',
      },
      
      {
        id: '2.7',
        name: 'confirm_password',
        message: 'Confirm Password is required',
      },
      
      {
        id: '2.8',
        name: 'confirm_password_mismatch',
        message: 'Password & Confirm Password is mismatch',
      },
    ],
  },
];

export const getErrorMsg = (errorId: string, errorName: string): string => {
    for (const page of ErrorList) {
    const error = page.children.find((e) => e.id === errorId || e.name === errorName);
    if (error) {
      return error.message; 
    }
  }
  return ''; 
};
