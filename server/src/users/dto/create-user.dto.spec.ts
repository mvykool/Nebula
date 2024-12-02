import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto'; // The DTO class you want to test

describe('CreateUserDto', () => {
  it('should validate valid DTO', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'johndoe123';
    dto.email = 'john@example.com';
    dto.password = 'Password1!';

    const errors = await validate(dto);

    expect(errors.length).toBe(0); // Should pass validation with no errors
  });

  it('should return error for invalid name (too short)', async () => {
    const dto = new CreateUserDto();
    dto.name = 'J';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'johndoe'; // Invalid username (less than 2 characters)
    dto.email = 'john@example.com';
    dto.password = 'Password1!';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints?.minLength).toBe(
      'Name must have at least 2 letters',
    );
  });

  it('should return error for invalid username (too short)', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'j'; // Invalid username (less than 2 characters)
    dto.email = 'john@example.com';
    dto.password = 'Password1!';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints?.minLength).toBe(
      'Username must have at least 2 letters',
    );
  });

  it('should return error for invalid username (non-alphanumeric)', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'john@doe!'; // Invalid username (contains non-alphanumeric characters)
    dto.email = 'john@example.com';
    dto.password = 'Password1!';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints?.isAlphanumeric).toBe(
      'username doesnt allow other than alpha numeric characters',
    );
  });

  it('should return error for invalid email format', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'johndoe123';
    dto.email = 'invalid-email'; // Invalid email format
    dto.password = 'Password1!';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints?.isEmail).toBe('please provide valid email');
  });

  it('should return error for password (too short)', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'johndoe123';
    dto.email = 'john@example.com';
    dto.password = 'short'; // Invalid password (too short)

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.matches).toBe(
      'password must contain min 8 and max 20 characters, at least one upper case letter, one lowercase letter, one number, and one special character',
    );
  });

  it('should return error for password (missing special character)', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'johndoe123';
    dto.email = 'john@example.com';
    dto.password = 'Password123'; // Invalid password (missing special character)

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.matches).toBe(
      'password must contain min 8 and max 20 characters, at least one upper case letter, one lowercase letter, one number, and one special character',
    );
  });

  it('should return error for password (missing uppercase letter)', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.picture = 'http://example.com/pic.jpg';
    dto.username = 'johndoe123';
    dto.email = 'john@example.com';
    dto.password = 'password1!'; // Invalid password (missing uppercase letter)

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Expect validation errors
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.matches).toBe(
      'password must contain min 8 and max 20 characters, at least one upper case letter, one lowercase letter, one number, and one special character',
    );
  });
});
