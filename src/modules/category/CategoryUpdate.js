import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import Input from "../../components/input/Input";
import Radio from "../../components/check-box/Radio";
import { categoryStatus } from "../../untils/constant";
import { Button } from "../../components/button";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebaseConfig";
import slugify from "slugify";

export default function CategoryUpdate() {
  const { control, handleSubmit, watch, reset } = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const [params] = useSearchParams();
  const idCategory = params.get("id");

  const watchStatus = watch("status");

  const navigate = useNavigate();

  const handleUpdateCategory = async (values) => {
    const colRef = doc(db, "categories", idCategory);
    await updateDoc(colRef, {
      name: values.name,
      slug: slugify(values.name || values.slug, { lower: true }),
      status: Number(values.status),
    });
    navigate("/manage/category");
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "categories", idCategory);
      const dataCategory = await getDoc(colRef);
      reset(dataCategory.data());
    }
    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-[50px]">
      <DashboardHeading
        title="Update category"
        desc={`Update category id: ${idCategory}`}
      ></DashboardHeading>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(handleUpdateCategory)}
      >
        <div className="grid grid-cols-2 gap-5 form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
              className="input"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
              className="input"
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
}
