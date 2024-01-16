interface IImageChangeProp {
  imageUrl: string;
  img_public_id: string;
  email: string;
}
export async function ChangeImage(body: IImageChangeProp) {
  const res = await fetch("http://localhost:4000/auth/change-profile-picture", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
}
