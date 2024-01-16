import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChangePasswordForm from "./change-password-form";
import { useAuth } from "../../../../../../../context/auth-provider";
import { useFormik } from "formik";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ref } from "yup";
import { UpdateProfile } from "../../../../../../../services/auth/auth.service";
import ChangeProfile from "./chage-profile";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/loader";
import * as yup from "yup";
import { Briefcase, Plus, User } from "lucide-react";
import AccountSwitcher from "../../account-switcher";
import LinkAccountDialog from "./link-account-dialog";

const validationSchema = yup.object({
  password: yup.string(),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match"),
});
const dummyAccounts = [
  {
    label: "personal",
    email: "test@xyz.com",
    icon: <User />,
  },
  {
    label: "work",
    email: "test2@xyz.com",
    icon: <Briefcase />,
  },
];
export default function SideForm() {
  const { user, refetch, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      ...user,
      cpassword: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      const { cpassword, ...rest } = values;
      const res = await UpdateProfile(rest, token);
      if (res.status) {
        toast.success("Profile Updated");
        refetch?.();
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    },
  });
  return (
    user && (
      <div className="grid gap-4 py-4">
        <form className="w-full grid gap-4" onSubmit={formik.handleSubmit}>
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
          {formik.touched.cpassword && formik.errors.cpassword ? (
            <div className="text-red-400  text-sm">
              {formik.errors.cpassword}
            </div>
          ) : null}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fname" className="capitalize">
              fist name
            </Label>
            <Input
              id="fname"
              placeholder="First Name"
              name="firstName"
              className="col-span-3"
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lname" className="capitalize">
              last name
            </Label>
            <Input
              id="lname"
              placeholder="Last Name"
              name="lastName"
              className="col-span-3"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="capitalize">
              email id
            </Label>
            <Input
              id="email"
              placeholder="Email"
              name="email"
              className="col-span-3"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>

          <div className="w-full flex items-center justify-end gap-4">
            <ChangePasswordForm
              values={{
                password: formik.values.password,
                cpassword: formik.values.cpassword,
              }}
              onChange={(e) => {
                formik.setFieldValue("password", e.password);
                formik.setFieldValue("cpassword", e.cpassword);
              }}
            >
              <Button
                className="w-1/2 font-semibold px-2"
                variant="default"
                type="button"
              >
                Change Password
              </Button>
            </ChangePasswordForm>

            <Button
              className="w-1/3 font-semibold px-2"
              variant="default"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader /> : " Save Changes"}
            </Button>
          </div>
          <Separator className="my-2" />
          {formik.values.imageUrl && (
            <>
              <h1 className="text-md font-semibold">Change Profile Picture.</h1>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="relative w-16 h-16 ">
                  <Image
                    src={user?.imageUrl}
                    alt="user image"
                    fill
                    className="w-auto h-auto rounded-full object-cover"
                  />
                </div>
                <div className="col-span-2">
                  <ChangeProfile
                    value={{
                      imageUrl: formik.values.imageUrl,
                      email: formik.values.email ?? "",
                      img_public_id: formik.values.img_public_id ?? "",
                      img_signature: formik.values.img_signature ?? "",
                    }}
                    onChange={() => refetch?.()}
                  >
                    <Button variant="default" className="w-full font-semibold">
                      Change
                    </Button>
                  </ChangeProfile>
                </div>
              </div>
            </>
          )}
        </form>
        <Separator className="my-2" />
        <LinkAccountDialog>
          <Button className="flex gap-2">
            <Plus size={10} />
            Link another account
          </Button>
        </LinkAccountDialog>
        <h1 className="text-sm font-semibold">Set Account</h1>
        <AccountSwitcher
          isCollapsed={false}
          linkedAccounts={user.linkedAccounts}
          user={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
            id: user.id,
          }}
        />
      </div>
    )
  );
}
