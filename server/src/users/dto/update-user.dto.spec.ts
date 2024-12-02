import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('should validate empty DTO', async () => {
    const dto = new UpdateUserDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Should be valid with no fields
  });

  it('should validate partial update with valid name', async () => {
    const dto = new UpdateUserDto();
    dto.name = 'John Doe Updated';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error for invalid name (too short)', async () => {
    const dto = new UpdateUserDto();
    dto.name = 'J'; // Invalid name (less than 2 characters)

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const nameErrors = errors.filter((error) => error.property === 'name');
    expect(nameErrors[0].constraints?.minLength).toBe(
      'Name must have at least 2 letters',
    );
  });

  it('should validate partial update with valid email', async () => {
    const dto = new UpdateUserDto();
    dto.email = 'newemail@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error for invalid email format', async () => {
    const dto = new UpdateUserDto();
    dto.email = 'invalid-email';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const emailErrors = errors.filter((error) => error.property === 'email');
    expect(emailErrors[0].constraints?.isEmail).toBe(
      'please provide valid email',
    );
  });

  it('should validate partial update with valid username', async () => {
    const dto = new UpdateUserDto();
    dto.username = 'newusername123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error for invalid username (non-alphanumeric)', async () => {
    const dto = new UpdateUserDto();
    dto.username = 'john@doe!';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const usernameErrors = errors.filter(
      (error) => error.property === 'username',
    );
    expect(usernameErrors[0].constraints?.isAlphanumeric).toBe(
      'username doesnt allow other than alpha numeric characters',
    );
  });
});
