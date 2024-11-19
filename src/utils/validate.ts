import { UsernameEmailAndPasswordInput } from "src/resolvers/user";

export function validateRegisterUser(options: UsernameEmailAndPasswordInput) {
  if (!options.email!.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid Email",
      },
    ];
  }

  if (options.username!.includes("@")) {
    return [
      {
        field: "username",
        message: "Username cannot have @ in it",
      },
    ];
  }

  if (options.username!.length < 2) {
    return [
      {
        field: "username",
        message: "Username must be at least 3 characters long!",
      },
    ];
  }

  if (options.password.length < 8) {
    return [
      {
        field: "password",
        message: "Password must be at least 8 characters long!",
      },
    ];
  }

  return;
}
