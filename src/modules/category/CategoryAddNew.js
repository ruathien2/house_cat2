import React from "react";
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import Input from "../../components/input/Input";
import Radio from "../../components/check-box/Radio";
import { Button } from "../../components/button";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-app/firebaseConfig";
import { categoryStatus } from "../../untils/constant";
import slugify from "slugify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// const getCharacterValidationError = (string) => {
//   return `Your password must have at least 1 ${string} character`;
// };

// const schemaValidation = yup.object({
//   fullname: yup.string().required("Please enter your fullname"),
//   email: yup.string().email().required("Please enter your email"),
//   password: yup
//     .string()
//     .required("Please enter a password")
//     // check minimum characters
//     .min(8, "Password must have at least 8 characters")
//     // different error messages for different requirements
//     .matches(/[0-9]/, getCharacterValidationError("digit"))
//     .matches(/[a-z]/, getCharacterValidationError("lowercase"))
//     .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
// });

const CategoryAddNew = () => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const watchStatus = watch("status");

  const handleAddCategory = async (values) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: values.name,
        slug:
          slugify(values.name, { lower: true }) ||
          slugify(values.slug, { lower: true }),
        status: 1,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-[50px]">
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddCategory)}>
        <div className="grid grid-cols-2 gap-5 form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              type="text"
              control={control}
              name="name"
              placeholder="Enter your category name"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              type="text"
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <div className="flex flex-wrap gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={categoryStatus.APPROVED === Number(watchStatus)}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={categoryStatus.UNAPPROVED === Number(watchStatus)}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </div>
          </Field>
        </div>
        <Button kind="primary" type="submit" className="mx-auto">
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
