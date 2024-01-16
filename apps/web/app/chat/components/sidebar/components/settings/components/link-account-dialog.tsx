import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { LinkAccount } from "../../../../../../../services/auth/auth.service";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../../../context/auth-provider";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function LinkAccountDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, refetch } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const res = await LinkAccount(values, token);
      if (res.status) {
        toast.success("Account linked");
        formik.resetForm();
        refetch?.();
      } else {
        toast.error(res.message);
      }
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Link account with your account</DialogTitle>
          <DialogDescription>
            You can link your account with your other accounts. Just type your
            email and password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="gird grid-cols-4 gap-4 items-center">
            {formik.touched.email && formik.errors.email ? (
              <div className="capitalize text-xs text-red-400 mt-2">
                {formik.errors.email}
              </div>
            ) : null}
            <Label htmlFor="email" className="capitalize">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              className="col-span-3"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>
          <div className="gird grid-cols-4 gap-4 items-center">
            {formik.touched.password && formik.errors.password ? (
              <div className="capitalize text-xs text-red-400 mt-2">
                {formik.errors.password}
              </div>
            ) : null}
            <Label htmlFor="password" className="capitalize">
              password
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              className="col-span-3"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>
          <div className="w-full flex mt-3 justify-end">
            <Button className="text-sm font-semibold" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
