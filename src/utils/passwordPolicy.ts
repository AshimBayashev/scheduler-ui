export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_REQUIREMENTS_HINT = 'Не менее 8 символов, буква и цифра';
export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Пароль: не менее 8 символов, хотя бы одна буква и одна цифра';

export function validatePassword(value: string): string | null {
  if (value.length > PASSWORD_MAX_LENGTH) {
    return 'Пароль не длиннее 128 символов';
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return PASSWORD_REQUIREMENTS_MESSAGE;
  }
  if (!/[A-Za-zА-Яа-яЁё]/.test(value)) {
    return PASSWORD_REQUIREMENTS_MESSAGE;
  }
  if (!/\d/.test(value)) {
    return PASSWORD_REQUIREMENTS_MESSAGE;
  }
  return null;
}
