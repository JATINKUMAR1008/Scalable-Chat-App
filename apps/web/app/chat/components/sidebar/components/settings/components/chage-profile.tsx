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
import { useFormik } from "formik";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Cloudinary } from "@cloudinary/url-gen";
import { ChangeImage } from "../../../../../../../services/auth/image.service";
import Loader from "@/components/loader";
interface IProps {
  children: React.ReactNode;
  value: {
    imageUrl: string;
    email: string;
    img_public_id: string;
    img_signature: string;
  };
  onChange: () => void;
}

export default function ChangeProfile({ children, value, onChange }: IProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imgPreview, setImagePreview] = useState<string>(value.imageUrl);
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      file: null as File | null,
      email: value.email,
    },
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      const preset_key = "am9op2bj";
      const cloud_name = "dhiykiupn";
      if (values.file) {
        const data = new FormData();
        data.append("file", values.file as File);
        data.append("upload_preset", preset_key);

        const img_res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const img_data = await img_res.json();
        const { file, ...rest } = values;
        const sendableObject = {
          ...rest,
          imageUrl: img_data.secure_url,
          img_public_id: img_data.public_id,
          img_signature: img_data.signature,
        };
        const res = await ChangeImage(sendableObject);
        if (res.status) {
          toast.success("image changed successfully");
          formik.resetForm();
          onChange();
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Please upload your image");
      }
      setLoading(false);
    },
  });

  const handleImageUpload = async () => {
    const element = document.getElementById("imageUpload") as HTMLInputElement;
    if (element?.files) {
      const file = element.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        formik.setFieldValue("file", file);
      }
    }
  };
  const handleRemoveImage = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setImagePreview(value.imageUrl);
    formik.setFieldValue("file", null);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Make sure to upload appropriate content. Otherwise strict actions
            will be taken.
          </DialogDescription>
        </DialogHeader>
        <form className="w-full" onSubmit={formik.handleSubmit}>
          <div className="w-full grid grid-cols-6 gap-4">
            <div className="relative w-[200px] h-[200px] col-span-3">
              <Image
                src={imgPreview}
                alt="user image"
                fill
                className="rounded-md shadow-md"
              />
            </div>

            <div className="col-span-3 h-full">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
                ref={inputRef}
              />
              <div>
                <Button
                  variant="ghost"
                  className="w-full capitalize border font-semibold"
                  onClick={() => {
                    const element = document.getElementById("imageUpload");
                    if (element) {
                      element.click();
                    }
                  }}
                  type="button"
                >
                  Select new image.
                </Button>
              </div>
              {formik.values.file ? (
                <>
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      className="w-full capitalize border font-semibold"
                      onClick={handleRemoveImage}
                      type="button"
                    >
                      Remove image.
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end my-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
