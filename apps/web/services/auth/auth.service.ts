interface ISignUpBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
interface ISignInBody {
  email: string;
  password: string;
}

interface IChangeProfilePayload {
  password: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  id?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  imageUrl?: string | undefined;
  img_public_id?: string | undefined;
  img_signature?: string | undefined;
}

export async function GetInfo(id: string) {
  const res = await fetch("http://localhost:4000/auth/get-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  return data;
}

export async function GetList(token: string) {
  const res = await fetch("http://localhost:4000/auth/get-data-list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
}

export async function LinkAccount(body: IChangeProfilePayload, token: string) {
  const res = await fetch("http://localhost:4000/auth/link-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
}

export async function SwitchAccount(id: string, token: string) {
  console.log(id);
  const res = await fetch("http://localhost:4000/auth/switch-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  localStorage.setItem("chat-token", data.token);
  return data;
}

export async function UpdateProfile(
  body: IChangeProfilePayload,
  token: string
) {
  const res = await fetch("http://localhost:4000/auth/change-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

export async function createAccount(body: ISignUpBody) {
  const res = await fetch("http://localhost:4000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  localStorage.setItem("chat-token", data.token);
  return data;
}

export async function login(body: ISignInBody) {
  const res = await fetch("http://localhost:4000/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  localStorage.setItem("chat-token", data.token);
  return data;
}
export async function logUser(token: string) {
  const res = await fetch("http://localhost:4000/auth/log-user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
}
