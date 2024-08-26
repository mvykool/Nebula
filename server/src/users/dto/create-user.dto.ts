import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsString,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 letters' })
  @IsNotEmpty()
  name: string;

  @IsString()
  picture: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Username must have at least 2 letters' })
  @IsAlphanumeric(null, {
    message: 'username doesnt allow other than alpha numeric characters',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail(null, { message: 'please provide valid email' })
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message:
      'password must contain min 8 and max 20 characters, at least one upper case letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
