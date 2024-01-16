import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FormProps {
  password: string;
  cpassword: string;
}

interface IProps {
  values: FormProps;
  onChange: (values: FormProps) => void;
  children: React.ReactNode;
}

export default function ChangePasswordForm({
  values,
  onChange,
  children,
}: IProps) {
  const [formData, setFormData] = useState(values);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Make sure to save your password with you. you can{"'"}t be able to
            recover it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 items-center gap-4 mt-3">
          <Label
            htmlFor="password"
            className="capitalize text-sm font-semibold col-span-2"
          >
            new password
          </Label>
          <Input
            type="password"
            className="col-span-3"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-5 items-center gap-4">
          <Label
            htmlFor="cpassword"
            className="capitalize text-sm font-semibold col-span-2"
          >
            confirm password
          </Label>
          <Input
            type="password"
            className="col-span-3"
            name="cpassword"
            id="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
          />
        </div>
        <DialogClose asChild>
          <div className="w-full flex justify-end my-2">
            <Button onClick={() => onChange(formData)}>Next</Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
